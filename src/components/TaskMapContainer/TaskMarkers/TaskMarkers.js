// TODO add color per marker type: material_need | one_time_task DONE
// TODO update the png icons; better colors and quality; update Icon size settings

import React, {useContext} from 'react';
import {Marker, Popup} from 'react-leaflet';
import {Icon} from 'leaflet';
import assistance from './assistance.png';
import assistance_shadow from './assistance_shadow.png';
import donate from './donate.png';
import donate_shadow from './donate_shadow.png';
import unpublished from './unpublished.png';
import unpublished_shadow from './unpublished.png';
// import tasks from '../../../services/tasks';
// import ChatBox from '../../ChatBox';
import {UserProfileContext,} from '../../../AppPrelude';
import TaskPopup from '../../TaskPopup';
import {ONETIMETASK} from '../../../services/apiServices';
import VolunteerUserRoleTaskButtons from '../../VolunteerUserRoleTaskButtons';

export default function TaskMarkers({tasks, ...restOfProps}) {
    const {userProfile} = useContext(UserProfileContext);

    // need to randomly slightly shift tasks/requests with similar lat/lng to show separately on the map
    // msut be a state otherwise will change on every refresh
    // const [taskCoordsShift, setTaskCoordsShift] = useState(Math.random() / 1e3); // ((-1) ** (task.id % 2) * parseInt(task.id)) / 1e4;]

    const material_need = new Icon({
        iconUrl: donate,
        shadowUrl: donate_shadow,

        iconSize: [32, 32], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });

    const one_time_task = new Icon({
        iconUrl: assistance,
        shadowUrl: assistance_shadow,

        iconSize: [32, 32], // size of the icon
        shadowSize: [24, 32], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });

    // const material_need_unanswered = new Icon({
    //   iconUrl: donate,
    //   shadowUrl: donate_shadow,

    //   iconSize: [32, 32], // size of the icon
    //   shadowSize: [50, 64], // size of the shadow
    //   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //   shadowAnchor: [4, 62], // the same for the shadow
    //   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    // });

    // const one_time_task_unanswered = new Icon({
    //   iconUrl: assistance,
    //   shadowUrl: assistance_shadow,

    //   iconSize: [32, 32], // size of the icon
    //   shadowSize: [24, 32], // size of the shadow
    //   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //   shadowAnchor: [4, 62], // the same for the shadow
    //   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    // });

    // const material_need_closing = new Icon({
    //   iconUrl: donate,
    //   shadowUrl: donate_shadow,

    //   iconSize: [32, 32], // size of the icon
    //   shadowSize: [50, 64], // size of the shadow
    //   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //   shadowAnchor: [4, 62], // the same for the shadow
    //   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    // });

    // const one_time_task_closing = new Icon({
    //   iconUrl: assistance,
    //   shadowUrl: assistance_shadow,

    //   iconSize: [32, 32], // size of the icon
    //   shadowSize: [24, 32], // size of the shadow
    //   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //   shadowAnchor: [4, 62], // the same for the shadow
    //   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    // });

    const unpublished_task = new Icon({
        iconUrl: unpublished,
        // html: '<FaMinusSquare/>',
        shadowUrl: unpublished_shadow,

        iconSize: [32, 32], // size of the icon
        shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });

    const taskMarkers = tasks?.map((task) => {
        if (
            task.is_published &&
            !task.is_fullfilled &&
            !task.authz_volunteer_ids?.includes(userProfile.id)
        ) {
            // console.log(
            //   '### TaskMarkers: ',
            //   task,
            //   task.authz_volunteer_ids,
            //   task.authz_volunteer_ids?.includes(userProfile.id)
            // );

            // const taskCoordsShift = ((-1) ** (task.id % 2) * parseInt(task.id)) / 1e5;
            return (
                <Marker
                    position={[task.lat, task.lng]}
                    icon={task.kind === ONETIMETASK ? one_time_task : material_need}
                    key={task.id.toString()}>
                    <Popup>
                        <div className='card'>
                            <TaskPopup task={task}/>

                            <footer className='card-footer'>
                                <VolunteerUserRoleTaskButtons task={task}/>
                            </footer>
                        </div>
                    </Popup>
                </Marker>
            );
        } else if (!task.is_published && !task.is_fullfilled) {
            // return (
            //   <Marker
            //     position={[task.lat, task.lng]}
            //     icon={unpublished_task}
            //     key={task.id.toString()}>
            //     <Popup>
            //       <p>Request unpublished</p>
            //       <br />
            //     </Popup>
            //   </Marker>
            // );
            return null;
        } else {
            return null;
        }
    });
    return <>{taskMarkers}</>;
}
