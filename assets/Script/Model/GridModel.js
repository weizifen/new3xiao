import CellModel from './CellModel'
export default class loadGridView{
    constructor(){
        //Cell的总数
        this.cells=null;
        //创造出来的cell的类型
        this.createCellType=null;
        //默认获得
        this.cellTypenum=5
    }
    // 随机生成不同类型的cell
    // init初始化网格
    init(cellTypenum){
        this.setRandomTypeCell(cellTypenum||cellTypenum);
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


        checkAround(x,y){
            const checkDirection =function (x,y,direction){
                let quene=[];
                let point=cc.p(x,y);
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

                        if (tempX < 1 || tempX > 9
                            || tempY < 1 || tempY > 9   
                            || vis[tempX + tempY * 9] 
                            || !this.cells[tempY][tempX]) {
                            continue;
                        }
                    if(cellModel.type==this.cells[tempY][tempX].type){
                        vis[tempX + tempY * 9] = true;
                        quene.push(cc.p(tempX,tempY));
                    }
                }
            }
            return quene;
         }
         
         var resultRow=checkDirection.call(this,x,y,[cc.p(1,0),cc.p(-1,0)]);
         var resultCol=checkDirection.call(this,x,y,[cc.p(0,-1),cc.p(0,1)]);
         console.log(resultRow,resultCol)
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

// // 检查点周围
//     checkPoint(x,y){
//         let checkWithDirection = function (x, y, direction) {
//                 let queue = [];
//                 let vis = [];
//                 vis[x + y * 9] = true;
//                 queue.push(cc.p(x, y));
//                 let front = 0;
//                 // front(前)
//                 while (front < queue.length) {
//                     //let direction = [cc.p(0, -1), cc.p(0, 1), cc.p(1, 0), cc.p(-1, 0)];
//                     let point = queue[front];
//                     let cellModel = this.cells[point.y][point.x];
//                     front++;
//                     if (!cellModel) {
//                         continue;
//                     }
//                     for (let i = 0; i < direction.length; i++) {
//                         let tmpX = point.x + direction[i].x;
//                         let tmpY = point.y + direction[i].y;
//                         // (2,1);(0,1)(1,0)(1,1)
//                         // console.log(tmpX,tmpY)
//                         if (tmpX < 1 || tmpX > 9
//                             || tmpY < 1 || tmpY > 9
//                             || vis[tmpX + tmpY * 9]
//                             || !this.cells[tmpY][tmpX]) {
//                             continue;
//                         }
//                         if (cellModel.type == this.cells[tmpY][tmpX].type) {
//                             vis[tmpX + tmpY * 9] = true;
//                             queue.push(cc.p(tmpX, tmpY));
//                         }
//                     }
//                 }
//                 return queue;
//         }
//                 // 左右检测是否存在同种类型的cell
//             let rowResult = checkWithDirection.call(this,x,y,[cc.p(1, 0), cc.p(-1, 0)]);
//             // 上下检测是否存在同种类型的cell
//             let colResult = checkWithDirection.call(this,x,y,[cc.p(0, -1), cc.p(0, 1)]);
//             // console.log(rowResult);
//             // console.log(colResult)
//             let result = [];
//             let newCellStatus = "";
//             if(rowResult.length >= 5 || colResult.length >= 5){
//                 newCellStatus = CELL_STATUS.BIRD;
//             }
//             else if(rowResult.length >= 3 && colResult.length >= 3){
//                 newCellStatus = CELL_STATUS.WRAP;
//             }
//             else if(rowResult.length >= 4){
//                 newCellStatus = CELL_STATUS.LINE;
//             }
//             else if(colResult.length >= 4){
//                 newCellStatus = CELL_STATUS.COLUMN;
//             }
//             if(rowResult.length >= 3){
//                 result = rowResult;
//             }
//             if(colResult.length >= 3){
//                 let tmp = result.concat();
//                 colResult.forEach(function(newEle){
//                     let flag = false;
//                     tmp.forEach(function (oldEle) {
//                         if(newEle.x == oldEle.x && newEle.y == oldEle.y){
//                             flag = true;
//                         }
//                     }, this);
//                     if(!flag){
//                         result.push(newEle);
//                     }
//                 }, this);
//             }
//             return [result,newCellStatus, this.cells[y][x].type];

//     }

    // 判断地图上是否有超过两个个以上的cell相同
    checkCell(position){






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
