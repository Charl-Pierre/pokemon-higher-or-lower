import { useEffect, useState } from "react"
import { PokemonType } from "../utils/Api";
import PokemonCard from "./PokemonCard";
import { getRandomPokemon } from "../utils/Api";
import { RandomInteger, setCookie, getCookie} from "../utils/Utils";
import '../index.css';

/**
 * Component that contains the main higher-or-lower game loop
 */
export const Game = () => {

    // State of the current round
    const [roundState, setRoundState] = useState('new')

    // State that stores the current three Pokemon (2 visible, 1 in queue)
    const [mons, setMons] = useState<PokemonType[]>([])

    // State to track current and highest score
    const [score, setScore] = useState(0)
    var highscore = getCookie('highscore')
    if (highscore === "") highscore = '0'

    // Initialization
    useEffect(() => {
        initialize()     
    }, [])

    /**
     * Initializes the game. This includes resetting the score and reloading three new Pokemon
     */
    function initialize() {
        setRoundState('processing')
        setScore(0)
        setMons([])
        for(let i = 0; i < 3; i++){
            getRandomPokemon().then((data) => {

                // Pick a random stat that will be the target stat to be guessed
                data.display_stat = RandomInteger(0, 6)

                // Insert the received Pokemon into the state
                setMons((prevMons) => {

                    // Due to React Strict Mode occasionally running functions twice to ensure atomicity
                    // A check is done to ensure that we don't load more than 3 Pokemon
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

    /**
     * Function that increments score and handles transition to a new Pokemon
     */
    const incrementScore = () => {
        setRoundState('win')
        
        // Wait for animations to finish to finish
        setTimeout(() =>{

            // Increase score
            setScore(prev => prev + 1)

            // Fetch a new Pokemon to be stored in the queue
            getRandomPokemon().then((data) => {

                // Pick a random stat that will be the target stat to be guessed
                data.display_stat = RandomInteger(0, 6)

                // Insert Pokemon at the back of the queue
                setMons((prevMons) => {
                    var newMons = [...prevMons]
                    newMons.shift()
                    newMons.push(data)
                    return (newMons)
                })
                setRoundState('new')
            }).catch((error) => {
                console.log(error)
            })           
        }, 1200)
    }

    /**
     * Function that handles gameover logic
     */
    const endGame = () => {
        setRoundState('lose')

        // Wait for animations to finish before switching to the gameover screen
        setTimeout(() =>{
            setRoundState('gameover')   

            // Update highscore if necessary
            if (parseInt(highscore, 10) < score) {
                setCookie('highscore', score.toString()); 
            } 
        }, 1400)
    }

    /**
     * Function that controls what should happen based on the user's answer
     * @param {boolean} ishigher - Determines whether the user thinks the righthand Pokemon is higher or not
     */
    const inputAnswer = (ishigher : boolean) => {

        // Get the stat to be checked for both Pokemon
        var stat1 = mons[0].stats[mons[0].display_stat].base_stat
        var stat2 = mons[1].stats[mons[1].display_stat].base_stat

        // Determine whether the correct answer is 'higher'
        var correctAnswer = stat1 < stat2

        // User answer is accepted if same as the correct answer or if the two stats are equal
        var result = correctAnswer === ishigher || stat1 === stat2

        // Handle game flow based on correctness of user answer
        if (result) {
            incrementScore()
        } else {
            endGame()
        }
    }

    return (
        <span className="game h-full w-full">
            <div style={roundState === 'gameover' ? {animation: 'scoreAnim 1s ease 0s 1 normal forwards'} : {}}>
                <p className={"float-left pr-5 fixed z-10 text-2xl m-3 drop-shadow-lg" + (roundState === 'gameover' ? " -translate-x-1/2" : "")} 
                >Score: {score}</p>
            </div>
            <p className={"float-left bottom-0 pr-5 fixed z-10 text-2xl m-3 drop-shadow-lg"} 
                >Highscore: {highscore}</p>
            
            {/* Main game screen */}
            { roundState !== 'gameover' &&
                <>
                    <div className={'game-scroller game-scroller--' + roundState}>
                        {(mons.length === 3 && roundState !== 'processing') && <>
                            <PokemonCard data={mons[0]} index={0} roundState={roundState} />
                            <PokemonCard data={mons[1]} index={1} roundState={roundState} answerCallback={inputAnswer} />
                            <PokemonCard data={mons[2]} index={2} roundState={roundState} answerCallback={inputAnswer} />
                        </>}
                    </div>
                </>               
            }

            {/* Game over screen */}
            { roundState === 'gameover' &&
                <div 
                    className="gameover justify-center"
                    style={{
                        backgroundImage:
                        "linear-gradient(rgba(100, 100, 100, 0.45), rgba(5, 5, 5, 0.8)), " +
                        `url('${process.env.PUBLIC_URL}/images/backgrounds/${mons[2].types[0].type.name}.png')`
                }}>
                    <div className={"relative top-1/4"}>
                        <img
                            className={"h-1/3"}
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