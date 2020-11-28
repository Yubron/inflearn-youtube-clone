import React, {useEffect, useState,} from 'react'
import Axios from 'axios'


function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)
    
    useEffect(() => {
        
        let variable = { userTo: props.userTo } ;

        Axios.post('/api/subscribe/subscribeNumber', variable)
        .then( response => {
            if(response.data.success) {
                setSubscribeNumber(response.data.subscribeNumber);
            } else {
                alert('cannot receive subscribe number');
            }
        })
        
        let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId')};

        Axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then( response => {
            if(response.data.success) {
                setSubscribed(response.data.subscribed);
            } else {
                alert('cannot receive subscribe info');
            }
        });


    }, [])
    
    const onSubscribe = () => {
        let subscribedVaribale = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        // 구독해제
        if(Subscribed) {

            Axios.post('/api/subscribe/unSubscribe', subscribedVaribale)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1);
                        setSubscribed(!Subscribed);
                    } else {
                        alert('failed to unsubscribe');
                    }
                })

        // 구독
        } else {
            Axios.post('/api/subscribe/subscribe', subscribedVaribale)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1);
                        setSubscribed(!Subscribed);
                    } else {
                        alert('failed to subscribe');
                    }
                })
        }
    }

    return (
        <div>
             <button
                style= {{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', 
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    )
}

export default Subscribe
