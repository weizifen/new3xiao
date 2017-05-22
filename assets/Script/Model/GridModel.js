import CellModel from './CellModel'
export default class loadGridView{
    constructor(){
        //Cell的总数
        this.cells=null;
        //创造出来的cell的类型
        this.createCellType=null;
        //默认获得
        this.cellTypenum=5;
        this.startPos=cc.p(-1, -1);
    }
    // 随机生成不同类型的cell
    // init初始化网格
    init(cellTypenum){
        this.setRandomTypeCell(cellTypenum||this.cellTypenum);
        console.log(this.createCellType)
        this.cells=[]
        for(let i=1;i<=GRID_WIDTH;i++){
             this.cells[i]=[];
             for(let j=1;j<=GRID_HEIGHT;j++){
             this.cells[i][j]=new CellModel();
            }
        }

        for(var i = 1;i<=GRID_WIDTH;i++){

                 for(var j = 1;j <= GRID_HEIGHT;j++){
                //  this.cells[i][j].init(this.getSingleCellType());
                //  this.cells[i][j].setXY(j, i);
                // this.cells[i][j].setStartXY(j, i);
            let flag = true;
            // 设立标志位 ,如果便利查询同类型的结果大于2则从新获取该对象类型
            while(flag){
                flag = false;
                // 初始化cell的类型
                this.cells[i][j].init(this.getSingleCellType());
                // console.log(this.checkPoint(j, i))
                let result = this.checkAround(j, i)[0]

                
                if(result.length > 2){
                    flag = true;
                }
                this.cells[i][j].setXY(j, i);
                this.cells[i][j].setStartXY(j, i);
            }
        } 
    }};
    
    selectCell(pos){
        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效
        var startPos=this.startPos;
        var isEmpty=Math.abs((pos.x-startPos.x)+(pos.y-startPos.y))
        // 判断用户是否移动
        if(isEmpty!=1){
            this.startPos=pos;
            return [[],[]];
        }
        // 交换两点坐标并检查是否有连珠
        this.exchangeCell(startPos,pos);
        var typeCount1=this.checkAround(startPos.x,startPos.y)[0];
        var typeCount2=this.checkAround(pos.x,pos.y)[0];
        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(this.cells[startPos.y][startPos.x]);
        this.pushToChangeModels(this.cells[pos.y][pos.x]);
        let isCanBomb = (this.cells[pos.y][pos.x].status != CELL_STATUS.COMMON && // 判断两个是否是特殊的动物 
                        this.cells[startPos.y][startPos.x].status != CELL_STATUS.COMMON) ||
                        this.cells[pos.y][pos.x].status == CELL_STATUS.BIRD ||
                        this.cells[startPos.y][startPos.x].status == CELL_STATUS.BIRD;
        //相同类型的少于3(并返回初始位置返回)暂时类型都是common
        if(typeCount1.length<3&&typeCount2.length<3&&!isCanBomb){
        this.exchangeCell(startPos,pos);
        // 移动并回退的动画
        this.cells[pos.y][pos.x].moveToAndBack(startPos);        
        this.cells[startPos.y][startPos.x].moveToAndBack(pos);
        // 移动结束.
        this.startPos=cc.p(-1,-1);
        return [this.changeModels];
    }else{
        this.startPos = cc.p(-1,-1);
        this.cells[pos.y][pos.x].moveTo(pos, this.curTime);
        this.cells[startPos.y][startPos.x].moveTo(startPos, this.curTime);
        var checkPoint = [pos, startPos];
        this.curTime += ANITIME.TOUCH_MOVE;
        this.processCrush(checkPoint);
        return [this.changeModels, this.effectsQueue];

        }
    };
    // 数据改变
    exchangeCell(pos1,pos2){
        var tempModel=this.cells[pos1.y][pos1.x];
        //交换cell;
        this.cells[pos1.y][pos1.x]=this.cells[pos2.y][pos2.x];
        // 交换cell的位置
        this.cells[pos1.y][pos1.x].x=pos1.x;
        this.cells[pos1.y][pos1.x].y=pos1.y;
        this.cells[pos2.y][pos2.x]=tempModel;
        this.cells[pos2.y][pos2.x].x=pos2.x;
        this.cells[pos2.y][pos2.x].y=pos2.y;
        // console.log(this.cells[pos1.y][pos1.x])
    }
    // 改变的双方
    pushToChangeModels(model){
        if(isInArray(this.changeModels,model)){
            return;
        }
        this.changeModels.push(model);        
    }

// 移动事件


    cleanCmd(){
        for(let i = 1;i <= GRID_WIDTH;i++){
            for(let j = 1;j<=GRID_HEIGHT;j++){
                if(this.cells[i][j]){
                    this.cells[i][j].cmd=[];
                }
                
            }
        }
    }
    processCrush(checkPoint){
        let cycleCount = 0;
        while(checkPoint.length > 0){
        let bombModels = [];
        if(cycleCount == 0 && checkPoint.length == 2){ //特殊消除
            let pos1= checkPoint[0];
            let pos2 = checkPoint[1];
            console.log(pos1,pos2);
            let model1 = this.cells[pos1.y][pos1.x];
            let model2 = this.cells[pos2.y][pos2.x];
            if(model1.status == CELL_STATUS.BIRD || model2.status ==  CELL_STATUS.BIRD){
                let bombModel = null;
                if(model1.status == CELL_STATUS.BIRD){
                    model1.type = model2.type;
                    bombModels.push(model1);
                }
                else{
                    model2.type = model1.type;
                    bombModels.push(model2);
                }

            }
        }
        // console.log(checkPoint);
        for(var i in checkPoint){
            var pos = checkPoint[i];
            console.log(pos.y,pos.x);
            if(!this.cells[pos.y][pos.x]){
                continue;
            }
            var tmp = this.checkAround(pos.x, pos.y);
            var result = tmp[0];
            var newCellStatus = tmp[1];
            var newCellType = tmp[2];
            
            if(result.length < 3){
                continue;
            }
            for(var j in result){
                var model = this.cells[result[j].y][result[j].x];
                this.crushCell(result[j].x, result[j].y);
                if(model.status != CELL_STATUS.COMMON){
                    bombModels.push(model);
                }
            }
            this.createNewCell(pos, newCellStatus, newCellType);   

        }
        this.processBomb(bombModels);
        this.curTime += ANITIME.DIE;
        checkPoint = this.down();
        cycleCount++;
    }
}
    down(){
        let newCheckPoint = [];
        for(var i = 1;i<=GRID_WIDTH;i++){
            for(var j = 1;j <= GRID_HEIGHT;j++){
                if(this.cells[i][j] == null){
                    var curRow = i;
                    for(var k = curRow; k<=GRID_HEIGHT;k++){
                        if(this.cells[k][j]){
                            this.pushToChangeModels(this.cells[k][j]);
                            newCheckPoint.push(this.cells[k][j]);
                            this.cells[curRow][j] = this.cells[k][j];
                            this.cells[k][j] = null;
                            this.cells[curRow][j].setXY(j, curRow);
                            this.cells[curRow][j].moveTo(cc.p(j, curRow), this.curTime);
                            curRow++; 
                        }
                    }
                    var count = 1;
                    for(var k = curRow; k<=GRID_HEIGHT; k++){
                        this.cells[k][j] = new CellModel();
                        this.cells[k][j].init(this.getSingleCellType());
                        this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].setXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].moveTo(cc.p(j, k), this.curTime);
                        count++;
                        this.changeModels.push(this.cells[k][j]);
                        newCheckPoint.push(this.cells[k][j]);
                    }

                }
            }
        }
        this.curTime += ANITIME.TOUCH_MOVE + 0.3
        return newCheckPoint;
    }
    createNewCell(){
            if(status == ""){
                return ;
            }
            if(status == CELL_STATUS.BIRD){
                type = CELL_TYPE.BIRD
            }
            let model = new CellModel();
            this.cells[pos.y][pos.x] = model
            model.init(type);
            model.setStartXY(pos.x, pos.y);
            model.setXY(pos.x, pos.y);
            model.setStatus(status);
            model.setVisible(0, false);
            model.setVisible(this.curTime, true);
            this.changeModels.push(model);

    }
    processBomb(bombModels){
        while(bombModels.length > 0){
            let newBombModel = [];
            let bombTime = ANITIME.BOMB_DELAY;
            bombModels.forEach(function(model){
                if(model.status == CELL_STATUS.LINE){
                    for(let i = 1; i<= GRID_WIDTH; i++){
                        if(this.cells[model.y][i]){
                            if(this.cells[model.y][i].status != CELL_STATUS.COMMON){
                                newBombModel.push(this.cells[model.y][i]);
                            }
                            this.crushCell(i, model.y);
                        }
                    }
                    this.addRowBomb(this.curTime, cc.p(model.x, model.y));
                }
                else if(model.status == CELL_STATUS.COLUMN){
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        if (this.cells[i][model.x]) {
                            if (this.cells[i][model.x].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[i][model.x]);
                            }
                            this.crushCell(model.x, i);
                        }
                    }
                    this.addColBomb(this.curTime, cc.p(model.x, model.y));
                }
                else if(model.status == CELL_STATUS.WRAP){
                    let x = model.x;
                    let y = model.y;
                    for(let i = 1;i <= GRID_HEIGHT; i++){
                        for(let j = 1;j <= GRID_WIDTH; j++){
                            let delta = Math.abs(x - j) + Math.abs(y - i);
                            if(this.cells[i][j] && delta <= 2){
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i);
                            }
                        }
                    }
                }
                else if(model.status == CELL_STATUS.BIRD){
                    let crushType = model.type
                    if(bombTime < ANITIME.BOMB_BIRD_DELAY){
                        bombTime = ANITIME.BOMB_BIRD_DELAY;
                    }
                    if(crushType == CELL_TYPE.BIRD){
                        crushType = this.getSingleCellType(); 
                    }
                    for(let i = 1;i <= GRID_HEIGHT; i++){
                        for(let j = 1;j <= GRID_WIDTH; j++){
                            if(this.cells[i][j] && this.cells[i][j].type == crushType){
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i, true);
                            }
                        }
                    }
                    //this.crushCell(model.x, model.y);
                }
            },this);
            if(bombModels.length > 0){
                this.curTime += bombTime;
            }
            bombModels = newBombModel;
        }
    }
    crushCell(x,y,needShake){
            let model = this.cells[y][x];
            this.pushToChangeModels(model);
            if(needShake){
                model.toShake(this.curTime)
                model.toDie(this.curTime + ANITIME.DIE_SHAKE);
            }
            else{
                model.toDie(this.curTime);
            }
            this.addCrushEffect(this.curTime, cc.p(model.x, model.y));
            this.cells[y][x] = null;
    }
    addCrushEffect(playTime, pos){
        this.effectsQueue.push({
            playTime: playTime,
            pos: pos,
            action: "crush"
        });
    }

     checkAround(x,y){
            const checkDirection =function (x,y,direction){
                let quene=[];
                let point=cc.p(x,y);
                // 数组标志位0 0
                let vis = [];
                vis[x + y * 9] = true;
                quene.push(point);
                let before=0;
                while(before<quene.length){               
                    let point=quene[before];                
                    var cellModel=this.cells[point.y][point.x];
                    before++;
                    // console.log(cellModel);
                    if (!cellModel) {
                    continue;
                    }
                    for (let i=0;i<direction.length;i++){
                        let tempX=point.x+direction[i].x;
                        let tempY=point.y+direction[i].y;
                        // console.log(tempX+"X"+tempY);
                        // console.log(Boolean(vis[tempX + tempY * 9] ) );
                            if (tempX < 1 || tempX > 9
                                || tempY < 1 || tempY > 9   
                                || vis[tempX + tempY * 9] 
                                || !this.cells[tempY][tempX]) {
                                continue;
                            }
                            // 1 1 1
                            // vis [21 20 19]
                        if(cellModel.type==this.cells[tempY][tempX].type){
                            vis[tempX + tempY * 9] = true;
                            // console.log(tempX+"真"+tempY);
                            quene.push(cc.p(tempX,tempY));
                        }
                    }
                }
                return quene;
            }
            
         var resultRow=checkDirection.call(this,x,y,[cc.p(1,0),cc.p(-1,0)]);
         var resultCol=checkDirection.call(this,x,y,[cc.p(0,-1),cc.p(0,1)]);
        //  console.log(resultRow,resultCol)
        //  console.log("行列");
         let result = [];
         let newCellStatus = "";
            //  返回行列大于5 五消
            if(resultRow.length>=5||resultCol.length>=5){
                newCellStatus=CELL_STATUS.BIRD;
            }
            else if(resultRow.length>=3&&resultCol.length>=3){
                newCellStatus=CELL_STATUS.WRAP;
            }
            else if(resultRow.length>=4){
                newCellStatus=CELL_STATUS.LINE;

            }
            else if(resultCol.length>=4){
                newCellStatus=CELL_STATUS.COLUMN;
            }
                if(resultRow.length >= 3){
                    result = resultRow;
                }
                if(resultCol.length >= 3){
                    let tmp = result.concat();
                    // console.log(result) 
                    // console.log(tmp) 
                    resultCol.forEach(function(newEle){
                        let flag = false;
                        tmp.forEach(function (oldEle) {
                            if(newEle.x == oldEle.x && newEle.y == oldEle.y){
                                flag = true;
                            }
                        }, this);
                        if(!flag){
                            result.push(newEle);
                        }
                    }, this);
                }
                
                return [result,newCellStatus, this.cells[y][x].type];

        }






    // 获得不同类型的cell,并且不重复
    setRandomTypeCell(num){
       this.cellTypenum= num;
       this.createCellType=[];
       for(let i=1;i<=num;i++){
           while(true){
                var randomNum= Math.floor(Math.random()*CELL_BASENUM)+1;
                if(this.createCellType.indexOf(randomNum) == -1){
                this.createCellType.push(randomNum);
                break;
             }

           }
                
       }     
    };

    //获得单个celltype
    getSingleCellType(){
 
    var index = Math.floor(Math.random() * this.cellTypenum) ;
    return this.createCellType[index];
    }
    getCells(){
        return this.cells;
    }

}
