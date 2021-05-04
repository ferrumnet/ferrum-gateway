import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ProjectList } from './projectList/ProjectList';

export interface DashboardContentProps {
}

export function DashboardContent(props: DashboardContentProps) {
    // show pending init...
    return (
        <Switch>
            <Route path="/projects/public">
                <ProjectList type="public" />
            </Route>
            <Route path="/projects/private">
                <ProjectList type="private" />
            </Route>
        </Switch>
    );
}