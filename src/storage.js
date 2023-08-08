export const saveGameToStorage = ({matrix,rows,mines})=> {
  window.localStorage.setItem('matrix', JSON.stringify(matrix))
  window.localStorage.setItem('rows', JSON.stringify(rows))
  window.localStorage.setItem('mines', JSON.stringify(mines))
}
export const resetGameStorage = ()=> {
  window.localStorage.removeItem('matrix')
  window.localStorage.removeItem('rows')
  window.localStorage.removeItem('mines')
}