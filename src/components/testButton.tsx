import React from 'react';

type CardProps = {
  state: string
}

export const Card = ({ state }: CardProps) => {

  

  return (
    <div className='game'>
      <div className={'game-scroller game-scroller--' + state}>
        <div className='pack-term'>test1</div>
        <div className='pack-term'>test2</div>
        <div className='pack-term'>test3</div>
      </div>
    </div>
  )
}
