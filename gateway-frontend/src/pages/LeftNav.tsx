import React from 'react';
// @ts-ignore
import {NavBar} from 'component-library';
import { useHistory } from 'react-router';

export interface LeftNavProps {
}

export function LeftNav(props: LeftNavProps) {
    const history = useHistory();
    const navItems: {name: string, links: {key: string, name: string}[]}[] = [
        {
            name: 'Projects',
            links: [
                {
                    key: '/projects/public',
                    name: 'Public Sale',
                },
                {
                    key: '/projects/private',
                    name: 'Private Sale',
                },
            ],
        },
    ];
    return (
        <NavBar
            items={navItems}
            onLinkClick={(k: string) => { history.push(k); }}
         />
    )
}