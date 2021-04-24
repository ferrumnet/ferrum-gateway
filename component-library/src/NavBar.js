import React from 'react';
import { Nav } from '@fluentui/react/lib/Nav';

const navStyles = { root: { width: 250 } };


export function NavBar({items, onLinkClick}) {
    return (
        <Nav styles={navStyles}
            ariaLabel="Nav bar"
            groups={items}
            onLinkClick={(e, item) => onLinkClick(item.key)}
        />
    )
}