export default class CellModel{
    constructor(){
        this.type=null;
        this.status=CELL_STATUS.COMMON;

        this.x=1,
        this.y=1,
        this.StartX=1,
        this.StartY=1,

        this.cmd=[];
        this.isDeath=false;

    }
    init(type){
        this.type = type;
    }
    toDie(playTime){
        this.cmd.push({
        action: "toDie",
        playTime: playTime,
        keepTime: ANITIME.DIE
        });
        this.isDeath = true;
    }

  
    setStatus(status){
        this.status=status;
    }
    setXY(x,y){
        this.x=x;
        this.y=y;

    }
    setStartXY(x,y){
        this.StartX=x;
        this.StartY=y;
    }
    moveToAndBack(pos){
        var srcPos = cc.p(this.x,this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: 0,
            pos: pos
        });
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: ANITIME.TOUCH_MOVE,
            pos: srcPos
        });

    }
    moveTo(pos, playTime){
         // 初始位置
        var srcPos = cc.p(this.x,this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: playTime,
            pos: pos
        });
        this.x = pos.x;
        this.y = pos.y; 
    }
    toShake(playTime){
        this.cmd.push({
        action: "toShake",
        playTime: playTime,
        keepTime: ANITIME.DIE_SHAKE
        }); 
    }
    setVisible(playTime, isVisible){
        this.cmd.push({
        action: "setVisible",
        playTime: playTime,
        keepTime: 0,
        isVisible: isVisible
        });
    }        

    
    // 4消 wrap
    
    





}