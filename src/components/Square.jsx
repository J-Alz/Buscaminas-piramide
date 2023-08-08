import { useState } from "react"


export const Square = ({children, enabled,visible, updateMatrix, x, y, color, fail }) => {

	const classCell = `cell ${enabled?'visible':'invisible'}  c${color} ${color === 'X' ? 'X' : ''}`;

	//console.log(visible)

	const handleClick = () => {
		if(enabled && !fail)
			updateMatrix(x,y)
	}
	//
	return (
		<div className="cell-content">
			<div  className={classCell}>
				{enabled && children}
			</div>
			<div  className={`${enabled?'cell-cover':''} ${visible?'act':''}`  } onClick={handleClick}>

			</div>
		</div>
	)
}