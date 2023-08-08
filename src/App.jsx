import { useEffect, useState } from 'react'
import { Square } from './components/Square';
import { DIRECTIONS } from './constans';
import { resetGameStorage, saveGameToStorage } from './storage';



function App() {
  const [rows, setRows] = useState(()=>{
    const rowsFromStorage = window.localStorage.getItem('rows')
    return rowsFromStorage
      ? JSON.parse(rowsFromStorage)
      : 8
  });
  //const [cells] = useState(rows * (2 * rows - 1))
  //console.log(calcCols())
  let cols = 2 * rows - 1
  let cellMiddle = (cols - 1) / 2
  const [mines, setMines] = useState(()=>{
    const minesFromStorage = window.localStorage.getItem('mines')
    return minesFromStorage
      ? JSON.parse(minesFromStorage)
      : 7
  })
  const [fail, setFail] = useState(false)
  const [btn,setBtn] = useState(false)

  useEffect(() => {
    cols = 2 * rows - 1
    cellMiddle = (cols - 1) / 2
  }, [cols, cellMiddle])

  const gridRows = 'repeat(' + rows + ',50px)'
  const gridColumns = 'repeat(' + cols + ',50px)'


  function getNextValue(value) {
    return (value.value >= 0 && value.value < 8) ? { value: value.value + 1, visible: value.visible } : value;
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
    let grid = Array(rows).fill(null).map(() => Array(cols).fill({ value: 0, visible: false }));
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (x >= cellMiddle - y && x <= cellMiddle + y) {
        //if (!grid[y][x].visible) {
        if (!grid[y][x].visible && grid[y][x].value !== 'X') {
          grid[y][x] = { value: 'X', visible: false };
          wrapCell(grid, x, y);
          minesPlaced++;
        }
      }
    }
    return grid;
  })();


  const [matrix, setMatrix] = useState(() => {
    const matrixFromStorage = window.localStorage.getItem('matrix')
    return matrixFromStorage
      ? JSON.parse(matrixFromStorage)
      : createMatrix
  });

  const EnabledCells = (x, y) => x >= cellMiddle - y && x <= cellMiddle + y;

  const listCell = [];

  function checkAdjacentCells(row, col, grid) {
    listCell.push({ x: col, y: row });

    for (const [dx, dy] of DIRECTIONS) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !listCell.some((elemento) => elemento.x === newCol && elemento.y === newRow) &&
        grid[newRow][newCol].value !== 'X'
      ) {
        if (grid[newRow][newCol].value === grid[row][col].value) {
          grid[newRow][newCol].visible = true;
          checkAdjacentCells(newRow, newCol, grid);
        }
      }
    }
    return grid;
  }


  const updateMatrix = (x, y) => {
    let newMatrix = [...matrix]
    console.log('x:' + x + ' y: ' + y)
    newMatrix[y][x] = { value: matrix[y][x].value, visible: true }
    console.log(newMatrix[y][x].visible)
    newMatrix = checkAdjacentCells(y, x, newMatrix)//<--here
    setMatrix(newMatrix)
    saveGameToStorage({
      matrix: newMatrix,
      rows: rows,
      mines: mines,
    })

    if (matrix[y][x].value === 'X')
      setFail(true)
  }

  const handleRows = (e) => {
    if (!isNaN(e.target.value) && e.target.value >= 3) {
      setBtn(true)
      setRows(parseInt(e.target.value))
      setFail(false)
    }
  }
  const toogleBtn = () => {
    setBtn(!btn)
  }
  const toogleFail = () => {
    setFail(!fail)
  }

  const ResetGame = (event) => {
    event.preventDefault();
    setBtn(false)
    const newRows = parseInt(rows);
    const newMines = parseInt(mines);
    if (!isNaN(newMines) && !isNaN(newRows)) {
      resetGameStorage()

      cols = 2 * rows - 1
      //console.log(value +'.'+cols)
      cellMiddle = (cols - 1) / 2

      const newMatrix = createMatrix
      setMatrix(newMatrix)

    }
  }

  return (
    <main className="board">
      <div className='title'>
        <h1>Buscaminas</h1>
      </div>
      <form className='form' onSubmit={ResetGame}>
        <div>
          <label htmlFor="rows">Altura:</label>
          <input
            type="text"
            id='rows'
            value={rows}
            onChange={handleRows} />
        </div>
        <div>
          <label htmlFor="mines">Minas</label>
          <input
            type="number"
            id='mines'
            value={mines}
            onChange={(e) => setMines(parseInt(e.target.value))}
            max={mines + 4}
          />
        </div>
        <button type='submit'>Nuevo Juego</button>
      </form>
      <div className='table-static'>

        <section className="table">
          <div className='terrain' style={{ gridTemplateRows: gridRows, gridTemplateColumns: gridColumns }}>
            {
              matrix.map((row, y) => {
                return (
                  row.map((cell, x) => {
                    return (
                      <Square
                        key={`${x}${y}`}
                        enabled={EnabledCells(x, y)}
                        updateMatrix={updateMatrix}
                        x={x} y={y}
                        color={cell.value}
                        visible={cell.visible}
                        fail={fail}
                      >
                        { /*<small>[{x}][{y}]</small>*/}
                        {cell.value}
                      </Square>
                    )
                  })
                )
              })
            }
          </div>
        </section>
        <section className={btn && 'help'}>
            <div>
              <h1>Presione "Nuevo Juego" para comenzar a jugar</h1>
            </div>
        </section>
        <section className={fail && 'gameOver'}>
            <div>
              <h1>Game Over</h1>
              <p>Presione "Nuevo Juego" para volver a jugar</p>
            </div>
        </section>
      </div>
    </main>
  )
}

export default App
