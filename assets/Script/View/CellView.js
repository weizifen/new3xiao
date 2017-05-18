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
        defaultFrame:{
            default: null,
            type: cc.SpriteFrame
        }
        
},

    // use this for initialization
    onLoad: function () {

    },
    initWithCellModel(model){
      this.model=model;
      var x=model.position.StartX;
      var y=model.position.StartY;
      this.node.x=CELL_WIDTH*x;
      this.node.y=CELL_HEIGHT*y;
      this.node.getComponent(cc.Animation).stop();
      

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
