import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { GatewayProject } from '../../../../commons/types/dist';
import { GatewayAppState } from '../../common/GatewayAppState';
import { ProjectRaiseAccess } from 'types';
import { Link } from 'react-router-dom';

type ProjectListFilter = 'all' | 'my_projects';

interface ProjectListState {
    filter: ProjectListFilter,
}

interface ProjectListProps extends ProjectListState {
    openProjects: GatewayProject[],
    soonProjects: GatewayProject[],
    closedProjects: GatewayProject[],
}

function stateToProps(appState: GatewayAppState, typeFilter: ProjectRaiseAccess): ProjectListProps {
    const state = (appState.ui.projectList || {}) as ProjectListState;
    const userProjects = appState.connection?.userState?.userProjects?.favoriteProjectIds || [];
    const allProjects = (appState.data.state.allProjects || []).filter(p => {
        return (state.filter === 'my_projects' ? userProjects.find(upid => upid === p.projectId) : p) && p.raiseAccess === typeFilter;
    }).sort((p1, p2) => p1.priority > p2.priority ? 1 : -1);
    return {
        ...state,
        closedProjects: allProjects.filter(p => p.status === 'closed'),
        openProjects: allProjects.filter(p => p.status === 'open'),
        soonProjects: allProjects.filter(p => p.status === 'pending'),
    } as ProjectListProps;
}

export const ProjectListSlice = createSlice({
    name: 'projectList',
    initialState: {
        filter: 'all',
    } as ProjectListState,
    reducers: {
    },
    extraReducers: {
    },
});

export function Project(props: {project: GatewayProject}) {
    return (
        <div className="project-card-container">
            <img src={props.project.logo} alt="project logo" />
            <p>{props.project.description}</p>
            <span><small><b>{props.project.contributionCurrencies.map((c, i) => <i key={i}>{c.symbol} </i>)}</b></small></span>
            <br/>
            <h4>...</h4>
            <Link to={`projects/${props.project.projectId}`}></Link>
        </div>
    );
}

export function ProjectList(props: { type: ProjectRaiseAccess }) {
    const s = useSelector<GatewayAppState, ProjectListProps>(appS => stateToProps(appS, props.type));
    console.log('PROPS ARE ', {props, s});
    return (
        <>
        <h1>OPEN NOW ({props.type})</h1>
        {s.openProjects.map((p, i) => <Project key={i} project={p}/>)}
        <h1>COMING SOON</h1>
        {s.soonProjects.map((p, i) => <Project key={i} project={p}/>)}
        <h1>CLOSED</h1>
        {s.closedProjects.map((p, i) => <Project key={i} project={p}/>)}
        </>
    );
}