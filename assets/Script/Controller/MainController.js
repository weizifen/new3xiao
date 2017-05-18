import GridModel from '../Model/GridModel'
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
        gridView:{
            default:null,
            type:cc.Node,
        }
    },

    // use this for initialization
    onLoad: function () {
        this.gridModel=new GridModel();
        this.gridModel.init(5);        
        var gridScript=this.gridView.getComponent("GridView");
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gridModel.getCells());
        
    },
    selectCell(pos){
        return this.gridModel.selectCell(pos);
    }
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
