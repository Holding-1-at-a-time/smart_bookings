/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 04:15:10
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { useParams } from 'next/navigation';

export default function OrgSettingsPage(): JSX.Element {
    const params = useParams();
    const { orgId } = params as { orgId: string };

    return (
        <div>
            <h3 className="text-lg font-semibold">{orgId} Settings</h3>
            <p>Manage organization details, billing, and team configuration.</p>
        </div>
    );
}
