import { useState } from "react"


export const Square = ({children, enabled, updateMatrix, x, y, color }) => {
	const [visible,setVisible] = useState(enabled)
	let ClassName = `cell ${enabled?'visible':'invisible'}`

	if(color === '0'){
		ClassName += ' c0'
	}
	if(color === '1')
		ClassName += ' c1'
	if(color === 'X')
		ClassName += ' X'

	const on = () => {
		setVisible(!visible)
	}

	const handleClick = () => {
		on()
		enabled && updateMatrix(x,y)
	}
	return (
		<div className="cell0">
			<div  className={ClassName}>
				{enabled && children}
			</div>
			<div className={visible && 'cellz'} onClick={handleClick}>

			</div>
		</div>
	)
}