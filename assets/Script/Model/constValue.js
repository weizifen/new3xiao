// 网格的宽高
global.GRID_WIDTH=9;
global.GRID_HEIGHT=9;

// cell网格宽高
global.Grid_PIXEL_WIDTH=630;
global.Grid_PIXEL_HEIGHT=630;

// CELL的宽高
global.CELL_WIDTH=70;
global.CELL_HEIGHT=70;

// cell的种类数目
global.CELL_BASENUM=6;

global.isInArray = function(array, object){
    for(var i in array){
        if(array[i] == object){
            return true;
        }
    }
    return false;
}
//CELL的状态  正常 点击 三消 四消 五消 十字消除等
global.CELL_STATUS={
    COMMON: 0 ,
    CLICK: "click",
    LINE: "line",
    COLUMN: "column",
    WRAP: "wrap",
    BIRD: "bird"
}
global.ANITIME = {
    TOUCH_MOVE: 0.3,
    DIE: 0.2,
    DOWN: 0.5,
    BOMB_DELAY: 0.3,
    BOMB_BIRD_DELAY: 0.7,
    DIE_SHAKE: 0.4 // 死前抖动
}

