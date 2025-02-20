/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 04:14:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { useParams } from 'next/navigation';

export default function OrgDashboardPage(): JSX.Element {
    const params = useParams();
    const { orgId } = params as { orgId: string };

    return (
        <div>
            <h3 className="text-lg font-semibold">{orgId} Dashboard</h3>
            <p>Overview of performance, analytics, and recent activity.</p>
        </div>
    );
}
