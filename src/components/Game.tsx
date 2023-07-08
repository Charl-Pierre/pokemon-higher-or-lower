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
        initialize()     
    }, [])

    function initialize() {
        setRoundState('processing')
        setScore(0)
        setMons([])
        for(let i = 0; i < 3; i++){
            getRandomPokemon().then((data) => {
                console.log('3')
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
        setRoundState('new')
    }

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

    const endGame = () => {
        setRoundState('lose')
        runAfterCssAnimationComplete(1400, () =>{
            setRoundState('gameover')      
        })
    }

    const inputAnswer = (ishigher : boolean) => {
        var stat1 = mons[0].stats[mons[0].display_stat].base_stat
        var stat2 = mons[1].stats[mons[1].display_stat].base_stat
        var correctAnswer = stat1 < stat2
        var result = correctAnswer === ishigher || stat1 === stat2
        if (result) {
            incrementScore()
        } else {
            endGame()
        }
    }

    return (
        <span className="game h-full">
            <div style={roundState === 'gameover' ? {animation: 'scoreAnim 1s ease 0s 1 normal forwards'} : {}}>
                <p 
                    className={"float-right pr-5 fixed z-10 text-2xl m-3 drop-shadow-lg" + (roundState === 'gameover' ? " -translate-x-1/2" : "")} 
                >Score: {score}</p>
            </div>
            
            { roundState !== 'gameover' &&
                <>
                    <div className={'game-scroller game-scroller--' + roundState}>
                        {(mons.length === 3 && roundState !== 'processing') && <>
                            <PokemonCard data={mons[0]} index={0} roundState={roundState} />
                            <PokemonCard data={mons[1]} index={1} roundState={roundState} answerCallback={inputAnswer} />
                            <PokemonCard data={mons[2]} index={2} roundState={roundState} answerCallback={inputAnswer} hidden={roundState === 'new'} />
                        </>}
                    </div>
                </>               
            }
            { roundState === 'gameover' &&
                <div 
                    className="gameover justify-center"
                    style={{
                        backgroundImage:
                        "linear-gradient(rgba(100, 100, 100, 0.45), rgba(5, 5, 5, 0.8)), " +
                        `url('../../images/backgrounds/${mons[2].types[0].type.name}.png')`
                }}>
                    <div className={"relative top-1/4"}>
                        <img
                            className="h-72 pb-10"
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${mons[2].id.toString()}.png`}
                            alt={mons[2].name} />
                        You did your best.<br/>
                        <button
                            onClick={() => initialize()}
                            className="text-lg border-white border-2 rounded-lg w-36 h-12 my-2 hover:bg-white hover:text-black"
                        >Try again</button>
                    </div>                    
                </div>
            }

        </span>
    )
  }