import { useState } from "react"


export const Square = ({children, enabled,visible, updateMatrix, x, y, color }) => {

	const classCell = `cell ${enabled?'visible':'invisible'}  c${color} ${color === 'X' ? 'X' : ''}`;

	//console.log(visible)

	const handleClick = () => {
		enabled && updateMatrix(x,y)
	}

	return (
		<div className="cell0">
			<div  className={classCell}>
				{enabled && children}
			</div>
			<div  className={`${enabled?'cellz':''} ${visible?'act':''}`  } onClick={handleClick}>

			</div>
		</div>
	)
}