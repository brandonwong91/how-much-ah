import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes } from "react";

export function InputWithLabel({
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={props.id}>{props["aria-label"]}</Label>
      <Input {...props} />
    </div>
  );
}
