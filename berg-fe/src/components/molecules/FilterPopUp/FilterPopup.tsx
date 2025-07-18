import Box from '@mui/material/Box'
import ButtonComponent from '../../atoms/Button/Button'
import { Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

export default function FilterPopup({ filterName }: { filterName: any }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box>
            <ButtonComponent
                // id="demo-positioned-button"
                // aria-controls={open ? 'demo-positioned-menu' : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? 'true' : undefined}
                // onClick={handleClick}
                buttonVariant='secondary'
            >
                Filter
            </ButtonComponent>
            <Menu
                // id="demo-positioned-menu"
                // aria-labelledby="demo-positioned-button"
                // anchorEl={anchorEl}
                open={open}
                // onClose={handleClose}
                // anchorOrigin={{
                //     vertical: 'top',
                //     horizontal: 'left',
                // }}
                // transformOrigin={{
                //     vertical: 'top',
                //     horizontal: 'left',
                // }}
            >
                <MenuItem >Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        </Box>
    )
}
