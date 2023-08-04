import Checkbox from "./Checkbox"

export default function Settings({settings, setSettings} : {settings: SettingsType, setSettings: Function}){

    const changeStatSetting = (value : boolean, stat : string) => {
        var enabledStats = Object.keys(settings.Stats).filter((stat: string) => ((settings.Stats as any)[stat] === true))
        if (!value && enabledStats.length === 1) return
        setSettings({
            ...settings,
            Stats: {
                ...settings.Stats,
                [stat]: value
            }
        })
    }

    return(
        <div className={"fixed z-[100] h-full w-full bg-neutral-950/50 justify-center flex text-center"}>
            <div className={"fixed top-1/2 -translate-y-1/2 -translate-x-0.5"}>
                <p className={"text-4xl my-2"}>Settings</p>
                <div className={"grid grid-cols-2 divide-x-[3px] divide-neutral-900 [&>*]:px-2 [&>*]:text-left"}>
                    <div>
                        <b><u>Enable Stats</u></b><br/>
                        <Checkbox label="Health" value={settings.Stats["hp"]} onChange={(value : boolean)=>{changeStatSetting(value, 'hp')}}/><br/>
                        <Checkbox label="Attack" value={settings.Stats["attack"]} onChange={(value : boolean)=>{changeStatSetting(value, 'attack')}}/><br/>
                        <Checkbox label="Defense" value={settings.Stats["defense"]} onChange={(value : boolean)=>{changeStatSetting(value, 'defense')}}/><br/>
                        <Checkbox label="Special Attack" value={settings.Stats["special-attack"]} onChange={(value : boolean)=>{changeStatSetting(value, 'special-attack')}}/><br/>
                        <Checkbox label="Special Defense" value={settings.Stats["special-defense"]} onChange={(value : boolean)=>{changeStatSetting(value, 'special-defense')}}/><br/>
                        <Checkbox label="Speed" value={settings.Stats["speed"]} onChange={(value : boolean)=>{changeStatSetting(value, 'speed')}}/><br/>


                    </div>
                    <div><i>More<br/>settings<br/>to be<br/>added.</i></div>
                </div>
            </div>
            
        </div>
    )
}

export type SettingsType = {
    Stats: {
        "hp": boolean
        "attack": boolean
        "defense": boolean
        "special-attack": boolean
        "special-defense": boolean
        "speed": boolean
    }
}