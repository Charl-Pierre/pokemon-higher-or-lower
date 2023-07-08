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
    
    var statColors = {
        'hp': 'rgb(255,0,0)',
        'attack': 'rgb(240,128,48)',
        'defense': 'rgb(248,208,48)',
        'special-attack': 'rgb(104,144,240)',
        'special-defense': 'rgb(120,200,80)',
        'speed': 'rgb(248,88,136)'
    }

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
                <p className="text-4xl">{`${CapitaliseFirst(data.name)} (${data.national_id})`}</p>
                <img
                    className="h-64"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id.toString()}.png`}
                    alt={data.name} />
                <div>
                    has a
                    <b><span 
                        style={{color: (statColors as any)[data.stats[data.display_stat].stat.name]}} 
                        className={"inline mx-1.5"}>{data.stats?.[data.display_stat].stat.name.split('-').map(CapitaliseFirst).join(' ')}
                    </span></b> 
                    that is
                </div>


                {index === 0 && 
                    <>
                        <div className="text-yellow-300 text-4xl">{data.stats?.[data.display_stat].base_stat}</div>
                    </>
                }

                {index > 0 && 
                    <>
                        { (answerCallback && (roundState === 'new' || index === 2)) &&
                            <>
                                {['Higher', 'Lower'].map((value, index) => {
                                    return <button 
                                        key={value}
                                        onClick={() => answerCallback(!index)}
                                        className="text-lg border-white border-2 rounded-lg w-36 my-1 hover:bg-white hover:text-black"
                                    >{value}</button>
                                })}                               
                            </> 
                        }
                        { index === 1 && (roundState === 'win' || roundState === 'lose') &&
                            <>
                                <Motion defaultStyle={{ x: 0 }} style={{ x: spring(data.stats?.[data.display_stat].base_stat, { ...presets.stiff, damping: 25, precision: 0.1 }) }}>
                                    {value => <div className="text-yellow-300 text-4xl">{Math.min(value.x + 1, data.stats?.[data.display_stat].base_stat).toString().split('.')[0]}</div>}
                                </Motion>
                            </>
                        }
                    </>
                }
            </div>
        </div>
    )
}