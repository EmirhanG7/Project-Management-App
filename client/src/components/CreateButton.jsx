import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import {Loader2} from "lucide-react";

export default function CreateButton({ className, title, placeholder, submit, submitTitle, loading = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");


  const handleCancel = () => {
    setInputValue("");
    setIsExpanded(false);
  };

  const handleAdd = () => {
    setInputValue("");
    submit(inputValue);
    if(title !== 'Kart') {
      setIsExpanded(false);
    }
  };

  const transition = { type: "tween", duration: 0.2, ease: "easeInOut" };

  return (
  <div className={`bg-card text-muted-foreground hover:text-foreground w-full max-w-sm mx-auto flex flex-col ${className}`}>
      <AnimatePresence initial={false} mode="wait">
        {!isExpanded && (
          <motion.div
            key="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={transition}
          >
            <Button
              onClick={() => setIsExpanded(true)}
              className="w-full text-card dark:text-card-foreground hover:text-foreground hover:bg-accent"
            >
              {title}
            </Button>
          </motion.div>
        )}

        {isExpanded && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
            className="flex flex-col p-4 bg-card border border-border rounded shadow-lg gap-4"
          >
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className="mb-2 bg-background border-border text-foreground"
            />
            <div className="flex justify-between gap-2">
              <Button
                className="text-card-foreground hover:text-card-foreground"
                variant="destructive" onClick={handleCancel}>
                İptal
              </Button>
              {loading
                ?
                <Button disabled>
                  <Loader2 className="animate-spin" />
                </Button>
                :
                <Button
                  className="text-card-foreground hover:text-foreground"
                  disabled={inputValue === ""} onClick={handleAdd}>
                  {submitTitle}
                </Button>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
