import {useReducer,useEffect} from 'react'
import axios from 'axios'

const ACTION={
    MAKE_REQUEST:'make-request',
    GET_DATA:'get-data',
    ERROR:'error',
    UPDATE_HAS_NEXT_PAGE:'update_has_next_page'
}


const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json'

function reducer(state,action){

    switch (action.type){

        case ACTION.MAKE_REQUEST:
            return {loading:true,jobs:[]}
        case ACTION.GET_DATA:
            return {...state,loading: false,jobs: action.payload.jobs}
        case ACTION.ERROR:
            return {...state, loading: false,error:action.payload.error,jobs:[]}
        case ACTION.UPDATE_HAS_NEXT_PAGE:
            return {...state,hasNextPage:action.payload.hasNextPage}
        default:
            return state

    }

}

export default function UseFetchJobs(params,page){

    const [state,dispatch]=useReducer(reducer,
        {jobs:[],
        loading: true})

    useEffect(()=>{

        const cancelToken1=axios.CancelToken.source()

        dispatch({type: ACTION.MAKE_REQUEST})

        axios.get(BASE_URL,{
            cancelToken:cancelToken1.token,
            params:{markdown:true,page:page,...params}
        }).then(res=>{
            dispatch({type:ACTION.GET_DATA,payload:{jobs: res.data}})
        }).catch(err=>{
            if (axios.isCancel(err))
            return
            dispatch({type:ACTION.ERROR,payload:{error:err}})
        })

        const cancelToken2=axios.CancelToken.source()

        axios.get(BASE_URL,{
            cancelToken:cancelToken2.token,
            params:{markdown:true,page:page+1,...params}
        }).then(res=>{
            dispatch({type:ACTION.UPDATE_HAS_NEXT_PAGE,payload:{hasNextPage:res.data.length!==0}})
        }).catch(err=>{
            if (axios.isCancel(err))
            return
            dispatch({type:ACTION.ERROR,payload:{error:err}})
        })

        return ()=>{
            cancelToken1.cancel()
            cancelToken2.cancel()

        }

    },[params,page])

return state
}