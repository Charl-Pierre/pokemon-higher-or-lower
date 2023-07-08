import { PokemonType } from "./Game"
import { CapitaliseFirst } from "../utils/Utils"
import { Motion, spring, presets } from 'react-motion';

type PokemonCardType = {
    data: PokemonType
    hidden? : boolean
    index: number
    roundState: string
    answerCallback? : (isHigher: boolean) => void
}

export default function PokemonCard({ data, answerCallback, index, roundState, hidden } : PokemonCardType){
    
    return (
        <div
            className={'pack-term ' /*+ (hidden ? "hidden" : "")*/}
            style={{
                backgroundImage:
                    "linear-gradient(rgba(100, 100, 100, 0.45), rgba(5, 5, 5, 0.45)), " +
                    `url('../../images/backgrounds/${data.types[0].type.name}.png')`
            }}
        >
            <div className="pack-term__wrapper">
                <p className="text-7xl">{`(${data.national_id}) ${CapitaliseFirst(data.name)}`}</p>
                <img
                    className="h-64"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id.toString()}.png`}
                    alt={data.name} />

                {index === 0 && 
                    <>
                        has a {CapitaliseFirst(data.stats?.[data.display_stat].stat.name)} stat of<br/>
                        {data.stats?.[data.display_stat].base_stat}
                    </>
                }

                {index === 1 && 
                    <>
                        has a {CapitaliseFirst(data.stats?.[data.display_stat].stat.name)} that is...
                        { answerCallback && roundState === 'new' &&
                            <>
                                <button onClick={() => answerCallback(true)}>Higher</button>
                                <button onClick={() => answerCallback(false)}>Lower</button>
                            </> 
                        }
                        { roundState === 'win' &&
                            <>
                                <Motion defaultStyle={{ x: 0 }} style={{ x: spring(data.stats?.[data.display_stat].base_stat, { ...presets.stiff, damping: 25, precision: 0.1 }) }}>
                                    {value => <div>{Math.min(value.x + 1, data.stats?.[data.display_stat].base_stat).toString().split('.')[0]}</div>}
                                </Motion>
                            </>
                        }
                    </>
                }
            </div>
        </div>
    )
}