
import { useState } from 'react';
import './List.css';

export default function List(props) {

    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState('');

    const addHandler = () => {
        setEditing(true);
    }

    const closeEditing = () => {
        setEditing(false);
        setValue('');
    }

    const saveEditing = () => {
        if (value) {
            props.setData({
                items: [...props.items, value],
                title: props.title
            });
        }
        closeEditing();
    }

    const addButton = editing ?
        <div>
            <input value={value} onInput={(event) => setValue(event.target.value)}></input>
            <div onClick={saveEditing}>save</div>
            <div onClick={closeEditing}>close</div>
        </div>
    :
        <div onClick={addHandler} className='list-add'>
            add
        </div>;

    return (
        <div className='list'>
        <div className='list-header'>{props.title}</div>
        <div className='list-items'>
            {props.items.map((item) => {
                return (<div className='list-item' key={item}>
                    <div><input type="checkbox"></input></div>
                    <div>{item}</div>
                    <div>x</div>
                </div>)
            })}
        </div>
        {addButton}
        </div>
    );
}
