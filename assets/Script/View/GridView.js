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
        // 监听事件
        this.setListen();
    },
    setListen(){
        var self=this;
        // 点击交换
        this.node.on("touchstart",function(e){
           var getLocation=e.getLocation();
           var cellPositon=self.convertToGridValiditySpace(getLocation);
        })
    },
    //判断点击位置是否在范围内
    convertToGridValiditySpace(location){
        console.log(location);
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

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
