
export class NodeErrorHandling {
    static ignorable(e: Error): boolean {
        const emsg = e.toString();
        return NodeErrorHandling.ignorableMsg(emsg);
    }
    static ignorableMsg(emsg: string): boolean {
        if ((emsg || '').toLowerCase().indexOf('error: already registered') >= 0) {
            return true;
        }
    }
}