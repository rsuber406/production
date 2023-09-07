import axios from "axios"
import React from "react"


const ApiContext = React.createContext()
const userAxios = axios.create()
userAxios.interceptors.request.use(config=>{
    const token = localStorage.getItem('Token')
    config.headers.Authorization = `Bearer ${token}`
    return config
})

function ApiContextProvider (props){

    const [userState, setUserState]= React.useState({
        user: JSON.parse(localStorage.getItem('User')) || "",
        token: localStorage.getItem('Token') || "" ,
        errMsg: ""
    })
    const [prayerRequest, setPrayerRequest] = React.useState([])

    const [events, setEvents] = React.useState([])

    const [serving, setServing] = React.useState([])

    const [missions , setMissions]= React.useState([])

    const [logInfo, setLogInfo] = React.useState({
        username: "",
        password: ""
    })

    const[newPrayer, setNewPrayer]= React.useState({
        firstName: "",
        request: "",
        displayName: false,
        editing:false
    })
    const [prayerUpdate, setPrayerUpdate] = React.useState({
        firstName: "",
        request: ""
    })

    const [ eventsUpdate, setEventsUpdate]= React.useState({
        title: "",
        description: "",
        subject: "",
        dateRemoved: ""
    })

    const [newMission, setNewMission] = React.useState({
        title: "",
        location: "",
        description: ""
    })

    const [newService, setNewService] = React.useState({
        title: "",
        description: "",
        imgUrl: ""

    })
    const [displayForm, setDisplayForm]= React.useState(false)

    const [volunteers, setVolunteers] = React.useState([])




    function newPrayerInfo(event){
       
        const{name,value} = event.target
        console.log(name)
        
        setNewPrayer(prevState=>{
            if(name === 'displayName'){
                console.log('is true')
               const parseValue = JSON.parse(value)
                console.log(typeof(parseValue))
                return{
                    ...prevState,
                    [name]: parseValue
                }
            }
            else
            return{
                ...prevState,
                [name]: value
            }
        })
    }

    function submitPrayer(event){
        event.preventDefault()
        axios.post(`/api/prayer`, newPrayer)
            .then(res => setPrayerRequest(prevState=> [...prevState,res.data]))
            .catch(err => console.log(err.res.data.message))
    }



    function startEditingPrayer (id){
        
        const filteredPrayer = prayerRequest.filter((prayer)=>{
            if(id === prayer._id){
                prayer.editing = true
                return prayer
            }
            
        })
        
        setPrayerUpdate(prevState=>{
            return{
                firstName: filteredPrayer[0].firstName,
                request: filteredPrayer[0].request,
            }
        })
       
       
        setPrayerRequest(prevState=> prevState.map(prayer=> id === prayer._id ? filteredPrayer[0]: prayer))
    }



    function cancelPrayerEdit(id){
        
        const filteredPrayer = prayerRequest.filter((prayer)=>{
            if(prayer._id === id){
                
                prayer.editing = false
                return prayer
            }
            

        })
       
      
      setPrayerRequest(prevState=> prevState.map(prayer=> id === prayer._id ? filteredPrayer[0]: prayer))
    }
    function updatePrayerReq(event){
        const{name,value} = event.target
        setPrayerUpdate(prevState=>{
            return{
                ...prevState,
                [name]: value
            }
        })
    }

    function savePrayer(id){
            
           
        userAxios.put(`/api/auth/prayer/${id}`, prayerUpdate)
            .then(res => setPrayerRequest(prevState=> prevState.map(prayer => prayer._id === id ? res.data: prayer)))
            .catch(err => console.log(err.res.data.message))
    }

    function adminEventEdit(id){
        
        const filteredEvent = events.filter((event)=>{
            if(id === event._id){
                event.editing = true
                return event
            }
            
        })
        setEventsUpdate(prevState=>{
            return{
                title:filteredEvent[0].title,
                description: filteredEvent[0].description,
                subject: filteredEvent[0].subject
            }
        })
        setEvents(prevState=> prevState.map(events=> events._id === id ? filteredEvent[0]: events))
    }

    function adminCancelEdit(id){
       
        const filteredEvent = events.filter((event)=>{
            if(id === event._id){
                event.editing = false
                return event
            }
            
        })
        setEvents(prevState=> prevState.map(events => id === events._id ? filteredEvent[0]: events))
        
    }

    function adminEventEditing(event){
        const {name,value} = event.target
        setEventsUpdate(prevState=>{
            return{...prevState,
                [name]: value
            }
        })
    }
    

    function adminEventSave(id){
        userAxios.put(`/api/auth/eventUpdate/${id}`,eventsUpdate)
            .then(res=> setEvents(prevState=> prevState.map(events=> events._id === id ? res.data : events)))
            .catch(err => console.log(err.response.data.message))
            setEventsUpdate(prevState=>{
                return{
                    ...prevState,
                    title: "",
                    description: "",
                    subject: ""
                }
            })
    }
    function adminEventDelete(id){
        userAxios.delete(`/api/auth/eventUpdate/${id}`)
                .then(res=> setEvents(prevState=> prevState.filter(events=> id != events._id)))
                .catch(err => console.log(err.response.data.message))
    }

    function adminEventAdd(event){
        event.preventDefault()
        userAxios.post(`/api/auth/eventUpdate`, eventsUpdate)
                .then(res => setEvents(prevState => [...prevState, res.data]))
                .catch(err => console.log(err.response.data.message))
                setEventsUpdate(prevState => {
                    return{
                        ...prevState,
                        title: '',
                        description: '',
                        subject: ''                    
                    }
                })
    }

    function missionText(event){
            const {name,value} = event.target
            setNewMission(prevState=>{
                return{...prevState,
                    [name]: value
                }
            })
        }

     function newMissionTrip(event){
        console.log(event, 'this fired')
        event.preventDefault()
            
            userAxios.post(`/api/auth/service/mission`, newMission)
                .then(res=> setMissions(prevState=> [...prevState , res.data]))
                .catch(err => console.log(err))

               setNewMission(prevState=>{
                return{
                    title: '',
                    location: '',
                    description: ''
                }
               }) 
        }
        function beginMissionEdit(id){
            const unchanged = []
            const filteredMission = missions.filter((mission)=>{
                if(id === mission._id){
                    mission.editing = true
                    return mission
                }else unchanged.push(mission)
            })
            setNewMission(prevState => {
                return{...prevState,
                    title:filteredMission[0].title,
                    location: filteredMission[0].location,
                    description: filteredMission[0].description
                }
            })
            //proper way to do things, fix the other functions
            setMissions(prevState => prevState.map(mission=> id === mission._id ? filteredMission[0] : mission))
        }

        function cancelMissionEdit(id){
            
            const filteredMission = missions.filter((mission)=>{
                if(id === mission._id){
                    mission.editing = false
                    return mission
                }
            })
           
           setMissions(prevState => prevState.map(mission=> id === mission._id? filteredMission[0]: mission))
        }

        function saveMissionEdit(id){
            userAxios.put(`api/auth/service/mission/${id}`, newMission)
                    .then(res => setMissions(prevState=> prevState.map(mission=> id === mission._id? res.data: mission)))
                    .catch(err => console.log(err))
                    setNewMission(prevState=>{
                        return{
                            title: '',
                            location: '',
                            description: ''
                        }
                    })
        }
        function deleteMission(id){
            userAxios.delete(`/api/auth/service/mission/${id}`)
                .then(res => setMissions(prevState => prevState.filter(mission=> id != mission._id)))
                .catch(err => console.log(err))
        }

        function serviceChangeHandler(event){
            const {name,value} = event.target
            setNewService(prevState => {
                return{
                    ...prevState,
                    [name]: value
                }
            })
        }
        
        function newServing (event){
            event.preventDefault()
            if(newService.title != "" && newService.description != ""){
            userAxios.post(`/api/auth/service/serving`, newService)
                .then(res=> setServing(prevState=> [...prevState, res.data]))
                .catch(err => console.log(err.response.data.message))
                setNewService(prevState=>{
                    return{
                        title: "",
                     description: "",
                     imgUrl: ""
                    }
                })}
            
        }
        function beginServingEdit(id){
            const filteredService = serving.filter((serve)=>{
                if(id === serve._id){
                    serve.editing = true
                    return serve
                }
                setNewService(prevState=>{
                    return{...prevState,
                        title: filteredService[0].title,
                        description:filteredService[0].description,
                        imgUrl: filteredService[0].imgUrl
                    }
                })
            })
            setServing(prevState => prevState.map(serve=> id === serve._id? filteredService[0] : serve))
        }

        function cancelServeEdit(id){
            const filteredService = serving.filter((serve)=>{
                if(id === serve._id){
                    serve.editing = false
                    return serve
                }
                setNewService(prevState=>{
                    return{
                     title: "",
                     description: "",
                     imgUrl: ""


                    }
                })
            })
            setServing(prevState=> prevState.map(serve=> id === serve._id ? filteredService[0]: serve))
        }

        function saveServeEdit(id){
            userAxios.put(`/api/auth/service/serving/${id}`, newService)
                .then(res => setServing(prevState=> prevState.map(serve=> id === serve._id ? res.data : serve)))
                .catch(err => console.log(err.response.data.message))
                setNewService(prevState=>{
                    return{
                     title: "",
                     description: "",
                     imgUrl: ""
                    }
                })
        }

        function deleteService(id){
            userAxios.delete(`/api/auth/service/serving/${id}`)
                .then(res=> setServing(prevState=> prevState.filter(serve=> id != serve._id)))
                .catch(err => console.log(err.response.data.message))
        }

    
    function credentials(event){
        const {name, value} = event.target
        setLogInfo(prevState => {
            return{ ...prevState,
                [name]: value
            }
        })
    }

function getVolunteers(){
    userAxios.get('/api/auth/volunteers')
            .then(res => setVolunteers(res.data))
            .catch(err => console.log(err.response.data.message))
}

    function signOn(event){
        event.preventDefault()
        axios.post(`/api/accounts/login`, logInfo)
            .then(res => setUserState(prevState=>{
                getVolunteers()
                localStorage.setItem('Token', res.data.token)
                localStorage.setItem('User', JSON.stringify(res.data.user))
                return{
                    ...prevState,
                    user: res.data.user,
                    token: res.data.token,
                    errMsg: ""
                }
            }))
            .catch(err => setUserState(prevState=> {
                return{
                    ...prevState,
                    errMsg: err.response.data.message
                }
            }))
    }
    
    function logOut(){
        localStorage.removeItem('Token')
        localStorage.removeItem('User')
        setUserState(prevState=>{
            return{
                user: "",
                token: ""
            }
        })
    }
    function showForm(){
        console.log('fired')
        setDisplayForm(prevState=> !prevState)
    }

    function apiData(){
        axios.get(`/api/prayer`)
            .then(res => setPrayerRequest(res.data))
            .catch(err => console.log(err.res))

        axios.get('/api/events')
            .then(res=> setEvents(res.data))
            .catch(err => console.log(err.res.data.message))
        
        axios.get('/api/service/missions')
            .then(res => setMissions(res.data))
            .catch(err => console.log(err.res.data.message))

        axios.get('/api/service/volunteer')
            .then(res => setServing(res.data))
            .catch(err => console.log(err.res.data.message))
    }

    React.useEffect(()=>{
        apiData()
    },[])

    

    return(
        <ApiContext.Provider value={{
            user: userState,
            prayer: prayerRequest,
            events: events,
            serving: serving,
            missions: missions,
            credentials,
            signOn,
            newPrayerInfo,
            submitPrayer,
            logOut,
            startEditingPrayer,
            updatePrayerReq,
            savePrayer,
            cancelPrayerEdit,
            adminEventEdit,
            adminCancelEdit,
            adminEventEditing,
            adminEventSave,
            adminEventDelete,
            adminEventAdd,
            missionText,
            newMissionTrip,
            beginMissionEdit,
            cancelMissionEdit,
            saveMissionEdit,
            deleteMission,
            serviceChangeHandler,
            newServing,
            beginServingEdit,
            saveServeEdit,
            cancelServeEdit,
            deleteService,
            showForm,
            displayForm: displayForm,
            newService:newService,
            newMission: newMission,
            updateEvent:eventsUpdate,
            prayerUpdate: prayerUpdate
        }}>{props.children}
        
         </ApiContext.Provider>
    )


} export {ApiContext, ApiContextProvider}