import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transactions";
import { AlertTriangle } from "lucide-react";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumn = ({ category, categoryId, id }: Props) => {
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction()

  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId);
    }else{ 
        onOpenTransaction(id) 
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer hover:underline"
    >
      {category ? (
        category
      ) : (
        <span className="text-rose-500 flex items-center gap-1">
          <AlertTriangle size={14} className="text-rose-500" />
          Uncategorized
        </span>
      )}
    </div>
  );
};
