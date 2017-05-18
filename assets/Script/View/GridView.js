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
                console.log(type);
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
