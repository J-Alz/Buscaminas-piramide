export const saveGameToStorage = ({matrix})=> {
  window.localStorage.setItem('matrix', JSON.stringify(matrix))
  //window.localStorage.setItem('rows', JSON.stringify(rows))
  //window.localStorage.setItem('cols', JSON.stringify(cols))
}
export const resetGameStorage = ()=> {
  window.localStorage.removeItem('matrix')
  //window.localStorage.remoteItem('rows')
  //window.localStorage.remoteItem('cols')
}