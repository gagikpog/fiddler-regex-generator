
import { useState } from 'react';
import Switch from '@mui/material/Switch';

import { Button, Input, Box, IconButton }from '@mui/material';
import DeleteForever from '@mui/icons-material/DeleteForever';

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
            <Input margin="none" value={value} onInput={(event) => setValue(event.target.value)}></Input>
            <div onClick={saveEditing}>save</div>
            <div onClick={closeEditing}>close</div>
        </div>
    :
        <div onClick={addHandler} className='list-add'>
            <Button>add</Button>
        </div>;

    return (
        <div className='list'>
        <div className='list-header'>{props.title}</div>
        <div className='list-items'>
            {props.items.map((item) => {
                return (<div className='list-item' key={item}>

                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Switch></Switch>
                        <div className='list-item-text'>{item}</div>
                        
                        <IconButton aria-label="delete">
                            <DeleteForever color="action"/>
                        </IconButton>
                    </Box>
                </div>)
            })}
        </div>
        {addButton}
        </div>
    );
}
