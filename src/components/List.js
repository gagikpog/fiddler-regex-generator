
import { useState } from 'react';
import Switch from '@mui/material/Switch';

import { Button, Input , Box, IconButton, Tooltip }from '@mui/material';
import { DeleteForever, Close, AddTask } from '@mui/icons-material';

import './List.css';

export default function List(props) {

    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState('');
    const [inputError, setInputError] = useState(false);

    const addHandler = () => {
        setEditing(true);
    }

    const closeEditing = () => {
        setEditing(false);
        setValue('');
    }

    const saveEditing = () => {
        if (value) {

            const hasItem = !!props.items.find((item) => item.value === value);
            if (!hasItem) {

                const item = {
                    value,
                    enabled: true
                };
                props.setData({
                    items: [...props.items, item],
                    title: props.title
                });
                closeEditing();
            } else {
                setInputError(true);
            }
        }
    }

    const enabledChanged = (enabled, value) => {

        const items = [...props.items];

        const index = items.findIndex((item) => item.value === value);

        items[index] = {
            value,
            enabled
        };

        props.setData({
            items,
            title: props.title
        });
    }

    const removeItem = (value) => {

        const items = props.items;

        const newItems = items.filter((item) => item.value !== value);

        props.setData({
            items: newItems,
            title: props.title
        });
    }

    const addButton = editing ?
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Tooltip title={inputError ? `"${value}" already exist!` : ''} placement="top-end" open={inputError}>
                <Input
                    style={{ flex: 1 }}
                    value={value}
                    onInput={(event) => {setInputError(false);setValue(event.target.value)}}
                    error={inputError}
                    autoFocus={true}
                />
            </Tooltip>
            <IconButton onClick={saveEditing} disabled={!value}><AddTask color={value ? 'success' : 'disabled'} /></IconButton>
            <IconButton onClick={closeEditing} ><Close color="primary" /></IconButton>
        </Box>
    :
        <div onClick={addHandler} className='list-add'>
            <Button>add</Button>
        </div>;

    return (
        <div className='list'>
            <div className='list-header'>{props.title}</div>
            <div className='list-items'>
                {props.items.map((item) => {
                    return (<div className='list-item' key={item.value}>

                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Switch
                                checked={item.enabled}
                                onChange={(event) => enabledChanged(event.target.checked, item.value)}
                            />
                            <div className='list-item-text'>{item.value}</div>

                            <IconButton onClick={() => removeItem(item.value)}>
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
