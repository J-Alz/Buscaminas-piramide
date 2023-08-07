import { useState } from 'react'
import { Square } from './components/Square';
import { DIRECTIONS } from './constans';



function App() {
  const [rows, setRows] = useState(8);
  const [cells] = useState(rows * (2 * rows - 1))
  const [cols, setCols] = useState(cells / rows)
  const [cellMiddle,setCellMiddle] = useState((cols - 1) / 2)
  const [mines, setMines] = useState(7)
  
  const gridRows = 'repeat('+ rows +',50px)'
  const gridColumns = 'repeat('+cols+',50px)'

  function getNextValue(value) {
    const numericValue = parseInt(value, 10);
    return (numericValue >= 0 && numericValue < 8) ? (numericValue + 1).toString() : value;
  }

  function wrapCell(grid, x, y) {
    for (const [dx, dy] of DIRECTIONS) {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
          if (newX >= cellMiddle - newY && newX <= cellMiddle + newY) {
            grid[newY][newX] = getNextValue(grid[newY][newX]);
        }
      }
    }
  }

  const createMatrix = (() => {
    let grid = Array(rows).fill(null).map(() => Array(cols).fill('0'))
    let minesPlaced = 0;    

    //console.log('partida')
    while(minesPlaced < mines){
      const x = Math.floor(Math.random() * cols)
      const y = Math.floor(Math.random() * rows)
      if(x >= cellMiddle - y && x <= cellMiddle + y ){
        if(grid[y][x] !== 'X'){
          //console.log(x + '.' + y)
          grid[y][x] = 'X'          
          wrapCell(grid,x,y)
          minesPlaced++
        }
      }
    }
    return grid
  })
  
 
  const [matrix, setMatrix] = useState(createMatrix());

  const VisibleCell = ((x,y) => {

    return (x >= cellMiddle - y && x <= cellMiddle + y )
    //? true
    //: false
  })

  const updateMatrix = (x,y) =>{
    const newMatrix = [...matrix]
    //newMatrix[x,y] 
    console.log(newMatrix[y][x])//<--here

    for (const [dx, dy] of DIRECTIONS) {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows){
        console.log()
      }
    }
    return true
  }

  

  return (
    <main className="board">
      <div className='title'>
        <h1>Buscaminas</h1>
      </div>
      <form action="" className='form'>
        <div>
          <label htmlFor="">Altura:</label>
          <input type="number" min="3" max="10"/>
        </div>
        <div>
          <label htmlFor="">Minas</label>
          <input type="number" />
        </div>
        <button>Nuevo Juego</button>
      </form>
      <section className="table">
        <div className='terrain' style={{gridTemplateRows: gridRows, gridTemplateColumns: gridColumns}}>
        {
          matrix.map((row,y)=>{
            return(
              row.map((cell,x)=>{
                return(
                  <Square 
                    key={`${x}${y}`} 
                    enabled={VisibleCell(x,y)} 
                    updateMatrix={updateMatrix} 
                    x={x} y={y}
                    color={cell}
                  >
                    <small>[{x}][{y}]</small>
                    {cell}
                  </Square>
                )
              })
            )
          })
        }
        </div>
      </section>
    </main>
  )
}

export default App
