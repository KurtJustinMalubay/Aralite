import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCcw, Trash2 } from 'lucide-react'

interface Props { children:ReactNode }
interface State { error:Error|null }

export class ErrorBoundary extends Component<Props, State> {
  state:State={error:null}
  static getDerivedStateFromError(error:Error):State { return {error} }
  componentDidCatch(error:Error, info:ErrorInfo) { console.error('Aralite recovery boundary', error, info) }
  reload=()=>window.location.reload()
  reset=async()=>{try{await new Promise<void>((resolve,reject)=>{const request=indexedDB.open('aralite_sqlite_db',1);request.onsuccess=()=>{request.result.close();resolve()};request.onerror=()=>reject(request.error)});indexedDB.deleteDatabase('aralite_sqlite_db');localStorage.clear()}catch{/* Fall back to reload */}finally{window.location.reload()}}
  render(){
    if(!this.state.error)return this.props.children
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5"><section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center"><AlertTriangle className="mx-auto mb-4 text-amber-600" size={44}/><h1 className="text-xl font-semibold">Aralite needs to recover</h1><p className="mt-2 text-sm leading-relaxed text-slate-600">The app hit an unexpected local data or display error. You can reload or clear only the local app cache.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={this.reload} className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 font-bold text-white"><RefreshCcw size={18}/>Reload App</button><button onClick={this.reset} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-rose-300 px-4 font-bold text-rose-700"><Trash2 size={18}/>Reset Local Cache</button></div></section></main>
  }
}
