/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 15:27:55
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );
}