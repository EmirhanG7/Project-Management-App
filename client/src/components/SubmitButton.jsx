import {Button} from "@/components/ui/button.js";
import {Loader2} from "lucide-react";

export default function SubmitButton({loading=false, submit, title}) {

  return (

    <>
      {
        loading ?
          <Button disabled className='w-full'>
            <Loader2 className="animate-spin" />
          </Button>
          :
          <Button className='w-full' onClick={submit}>{title}</Button>
      }
    </>


  )
}