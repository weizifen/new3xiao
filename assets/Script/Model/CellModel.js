export default class CellModel{
    constructor(){
        this.type=null;
        this.status=CELL_STATUS.NORMAL;
        this.position={
            x:1,
            y:1,
            StartX:1,
            StartY:1,
        };
    }
    init(type){
        this.type = type;
    }
  
    setXY(x,y){
        this.position.x=x;
        this.position.y=y;

    }
    setStartXY(x,y){
        this.position.StartX=x;
        this.position.StartY=y;
    }




}