/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 04:14:13
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { useParams } from 'next/navigation';

export default function OrganizationDetailPage(): JSX.Element {
    const params = useParams();
    const { orgId } = params as { orgId: string };

    return (
        <div>
            <h2 className="text-xl font-bold">Organization: {orgId}</h2>
            <p>Overview and organization details go here.</p>
        </div>
    );
}
