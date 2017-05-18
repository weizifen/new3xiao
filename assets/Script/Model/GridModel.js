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
                    let flag = true;                   
                        // 初始化cell的类型
                        this.cells[i][j].init(this.getSingleCellType());
            
                        this.cells[i][j].setXY(j, i);
                        this.cells[i][j].setStartXY(j, i);
                   
                }
            }
        // console.log(this.cells);
        // for(let i=1;i<=GRID_WIDTH;i++){
        //     for(let j=1;i<=GRID_HEIGHT;j++){
        //         console.log(this.getSingleCellType())
        //         this.cells[i][j].init(this.getSingleCellType());

        //         // console.log(this.cells[i][j].type);

        //         this.cells[i][j].setXY(j,i);
        //         this.cells[i][j].setStartXY(j,i);


        //     }
        // }
    };


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
