cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        animalPrefab:{
            default:[],
            type:cc.Prefab,
        }
    },

    // use this for initialization
    onLoad: function () {
        this.lastTouchPos = cc.Vec2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false; // 是否在播放中
        // 监听事件
        this.setListen();

    },
        initWithCellModels(cellsModels){
        this.cellViews = [];
        for(let i=1;i<=9;i++){
            this.cellViews[i] = [];
            for(let j=1;j<=9;j++){
                var type=cellsModels[i][j].type;
                // console.log(type);
                var cell=cc.instantiate(this.animalPrefab[type]);
                cell.parent=this.node;
                var cellScript=cell.getComponent("CellView");
                cellScript.initWithCellModel(cellsModels[i][j]);
                this.cellViews[i][j]=cell;

            }
        }
    },
    setListen(){
        var self=this;
        // 点击交换
        this.node.on("touchstart",function(e){
                if(this.isInPlayAni){
                    return true;
                }
            var getLocation=e.getLocation();
            var cellPositon=self.convertToGridValiditySpace(getLocation);
                if(cellPositon){
                    var changeModels = self.selectCell(cellPositon);
                    if(changeModels.length >= 3){
                        self.isCanMove = false;
                    }
                    else{
                        self.isCanMove = true;
                    }
                }
                else{
                    self.isCanMove = false;
                }
            return true;
        });
        this.node.on("touchmove",function(e){

        });
        this.node.on("touchend",function(e){
        //    var getLocation=e.getLocation();
        //    var cellPositon=self.convertToGridValiditySpace(getLocation);
        //    console.log(cellPositon)
        // if(cellPositon){
        //        self.selectCell(cellPositon); 
        //    }
        });

    },
    selectCell(cellPositon){
           var result =this.controller.selectCell(cellPositon); 
           console.log(result)
           var changeModels = result[0];
           var effectsQueue = result[1];
           console.log(changeModels.length)
           this.updateView(changeModels);
           this.controller.cleanCmd();
            if(changeModels.length >= 2){
                this.updateSelect(cc.p(-1,-1));
            }
            else{
                console.log("执行了")
                this.updateSelect(cellPositon);
            }
            return changeModels;


    },
    updateView(changeModels){
        let newCellViewInfo = [];
        console.log(changeModels);
        for(var i in changeModels){
            var model = changeModels[i];
            var viewInfo = this.findViewByModel(model);
            var view = null;
            // 如果cell不存在 生成新
            if(!viewInfo){
                console.log("执行了创建cell")
                var type = model.type;
                var aniView = cc.instantiate(this.animalPrefab[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithCellModel(model);
                view = aniView;
            }
            else{
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }
            var cellScript = view.getComponent("CellView");
            cellScript.updateView();
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            } 
        }
        newCellViewInfo.forEach(function(ele){
            let model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        },this);
    },
    findViewByModel(model){
        for(var i = 1;i <=9 ;i++){
            for(var j = 1 ;j <=9 ;j ++){
                if(this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model){
                    return {view:this.cellViews[i][j],
                            x:j, 
                            y:i};
                }
            }
        }
        return null;
    },
    // 更新你所选中的按钮
    updateSelect(pos){
        for(var i = 1;i <=9 ;i++){
            for(var j = 1 ;j <=9 ;j ++){
                if(this.cellViews[i][j]){
                    var cellScript = this.cellViews[i][j].getComponent("CellView");
                    if(pos.x == j && pos.y ==i){
                        cellScript.setSelect(true);
                        
                    }
                    else{
                        cellScript.setSelect(false);
                    }
                }
            }
        }
    },
    //判断点击位置是否在范围内
    convertToGridValiditySpace(location){
        // console.log(location);
        var pos=this.node.convertToNodeSpace(location);
        if((pos.x<0||pos>Grid_PIXEL_WIDTH)&&(pos.y<0||pos.y>Grid_PIXEL_HEIGHT)){
            return false;
        }
        
        var x= Math.floor(pos.x/CELL_WIDTH)+1;
        var y=Math.floor(pos.y/CELL_HEIGHT)+1;
        return cc.p(x,y);
    },
    setController(controller){
        this.controller=controller;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
