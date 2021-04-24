import React from 'react';
// @ts-ignore
import {NavBar} from 'component-library';

export interface LeftNavProps {
}

export function LeftNav(props: LeftNavProps) {
    const navItems: {name: string, links: {key: string, name: string}[]}[] = [
        {
            name: 'Projects',
            links: [
                {
                    key: 'upcoming',
                    name: 'Upcoming',
                },
                {
                    key: 'past',
                    name: 'Past',
                },
            ],
        },
    ];
    return (
        <NavBar
            items={navItems}
            onLinkClick={(k: string) => alert(k)}
         />
    )
}