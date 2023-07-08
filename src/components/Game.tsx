import { useEffect, useState } from "react"
import PokemonCard from "./PokemonCard";
import { getRandomPokemon } from "../utils/Api";
import { RandomInteger } from "../utils/Utils";
import '../index.css';

export type PokemonType = {
    id: number
    name?: string
    national_id: number
    types: {
        type: {
            name: string
        }
    }[]
    stats: {
        base_stat: number
        stat: {
            name: string
        }
    }[]
    display_stat: number
}


export const Game = ({ state } : any) => {

    const [roundState, setRoundState] = useState('new')
    const [mons, setMons] = useState<PokemonType[]>([])
    const [score, setScore] = useState(0)

    useEffect(() => {
        for(let i = 0; i < 3; i++){
            getRandomPokemon().then((data) => {
                data.display_stat = RandomInteger(0, 6)
                setMons((prevMons) => {
                    if (prevMons.length < 3){
                        var newMons = [...prevMons]
                        newMons.unshift(data)
                        return (newMons)
                    }
                    return prevMons
                })
            })
        }     
        
    }, [])

    function runAfterCssAnimationComplete(waitTimeMs : number, callback : () => void) {
        return new Promise((resolve : any, reject) => {
          setTimeout(() => {
            callback();
            resolve();
          }, waitTimeMs);
        });
      }

    const incrementScore = () => {
        setRoundState('win')
        runAfterCssAnimationComplete(1800, () =>{
            setScore(prev => prev + 1)
            getRandomPokemon().then((data) => {
                data.display_stat = RandomInteger(0, 6)
                setMons((prevMons) => {
                    var newMons = [...prevMons]
                    newMons.shift()
                    newMons.push(data)
                    return (newMons)
                })
                setRoundState('new')
            })           
        })
    }

    const inputAnswer = (ishigher : boolean) => {
        var correctAnswer = mons[0].stats[mons[0].display_stat].base_stat < mons[1].stats[mons[1].display_stat].base_stat
        var result = correctAnswer === ishigher
        if (result) incrementScore()
        //TODO: Finish logic
    }

    return (
      <span className="game h-full">
            Score: {score}
            <div className={'game-scroller game-scroller--' + roundState}>
                {(mons.length === 3 && roundState !== 'processing') && <>
                    <PokemonCard data={mons[0]} index={0} roundState={roundState} />
                    <PokemonCard data={mons[1]} index={1} roundState={roundState} answerCallback={inputAnswer} />
                    <PokemonCard data={mons[2]} index={2} roundState={roundState} hidden={roundState === 'new'} />
                </>}
            </div>

        </span>
    )
  }