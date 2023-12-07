import {
  FormEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  BiCalendar,
  BiCheckSquare,
  BiPlus,
  BiSquare,
  BiTrash,
} from "react-icons/bi";
import "./App.css";
import ClickAwayListener from "react-click-away-listener";
import classNames from "classnames";
import { formatDistanceStrict } from "date-fns";

interface Category {
  id: number;
  title: string;
  items: Item[];
}

interface Item {
  id: number;
  type: "task";
  title: string;
  description?: string;
  deadline?: string;
  status?: string;
  answer?: string;
}

type Action =
  | { type: "set"; categories: Category[] }
  | { type: "add"; categoryId: number; title: string }
  | { type: "remove"; categoryId: number; itemId: number }
  | { type: "update"; id: number; item: Omit<Item, "id"> };

function categoryDispatcher(categories: Category[], action: Action) {
  switch (action.type) {
    case "set":
      return action.categories;
    case "add":
      return categories.map((category) => {
        if (category.id === action.categoryId) {
          return {
            ...category,
            items: [
              ...category.items,
              {
                id: category.items.length + 1,
                type: "task",
                title: action.title,
                status: "todo",
              } as Item,
            ],
          };
        }
        return category;
      });
    case "update":
      console.log(59, action);
      return categories.map((category) => ({
        ...category,
        items: category.items.map((item) => {
          if (item.id === action.id) {
            return { id: action.id, ...action.item };
          }
          return item;
        }),
      }));
    default:
      throw new Error("Invalid action type");
  }
}

const StoreContext = createContext<{
  categories: Category[];
  dispatch: React.Dispatch<Action>;
}>({
  categories: [],
  dispatch: () => {},
});

const initial_categories: Category[] = [
  {
    id: 1,
    title: "Pre-comp",
    items: [
      {
        id: 1,
        type: "task",
        title: "Make schedule",
        description:
          "Use Adam Walker's tool to make a draft schedule, then share it with him. Final result should be exported to the WCA website",
        status: "completed",
        deadline: "2023-12-06",
      },
      {
        id: 2,
        type: "task",
        title: "Make website",
        status: "inProgress",
        deadline: "2023-12-12",
      },
      {
        id: 3,
        type: "task",
        title: "Announce Competition",
        status: "todo",
        deadline: "2023-12-21",
      },
    ],
  },
];

function App() {
  const [categories, dispatch] = useReducer<typeof categoryDispatcher>(
    categoryDispatcher,
    initial_categories
  );

  return (
    <StoreContext.Provider value={{ categories, dispatch }}>
      <div className="grid grid-cols-5">
        <div className="col-span-full h-20">Nav</div>
        <div className="col-span-1" />
        <div className="flex flex-col space-y-2 p-4 col-span-3">
          {categories.map((cat) => (
            <Category key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </StoreContext.Provider>
  );
}

function Category({ category }: { category?: Category }) {
  return (
    <div className="space-y-1">
      <div className="p-1 hover:bg-slate-100 transition-colors cursor-pointer">
        <span className="text-xl">{category?.title}</span>
      </div>
      <div>
        {category?.items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
        <Item />
      </div>
    </div>
  );
}

const ItemContext = createContext<{
  item?: Item;
  itemState: Omit<Item, "id">;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setItemState: React.Dispatch<React.SetStateAction<Omit<Item, "id">>>;
  reset: () => void;
  handleEnter: (e: FormEvent<HTMLFormElement>) => void;
}>({
  item: undefined,
  editing: false,
  setEditing: () => {},
  itemState: { type: "task", title: "" },
  setItemState: () => {},
  reset: () => {},
  handleEnter: () => {},
});

function Item({ item }: { item?: Item }) {
  const { dispatch } = useContext(StoreContext);
  const [editing, setEditing] = useState(false);
  const [itemState, setItemState] = useState<Omit<Item, "id">>(
    item || {
      title: "",
      type: "task",
    }
  );

  const reset = useCallback(() => {
    setEditing(false);
    setItemState(item || { title: "", type: "task" });
  }, [item]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (editing && e.key === "Escape") {
        reset();
      }
    },
    [editing, reset]
  );

  const handleEnter = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (editing && !item) {
        setEditing(false);
        dispatch({
          type: "add",
          categoryId: 1,
          title: itemState.title,
        });
      } else if (editing && item) {
        setEditing(false);
        dispatch({
          type: "update",
          id: item.id,
          item: { ...item, ...itemState },
        });
      }
    },
    [dispatch, editing, item, itemState]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const Component = ItemTask;

  // If no item, then we're adding an item
  if (!item && !editing) {
    return (
      <div
        className="flex space-x-2 hover:bg-slate-100 p-2 transition-colors cursor-pointer items-center delay-75 rounded-sm border-1  hover:border-slate-100"
        onClick={() => setEditing(true)}
      >
        <BiPlus className="text-2xl" />
        <span className="text-base">Add Item</span>
      </div>
    );
  } else if (!item && editing) {
    return (
      <ClickAwayListener onClickAway={reset}>
        <form onSubmit={handleEnter}>
          <div className="flex space-x-2 hover:bg-slate-100 p-2 transition-colors cursor-pointer delay-75 rounded-sm border-1  hover:border-slate-100">
            <input
              className="text-base flex-grow outline-none bg-inherit"
              placeholder="Title"
              autoFocus
              onBlur={() => setEditing(false)}
              value={itemState.title}
              onChange={(e) =>
                setItemState((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
        </form>
      </ClickAwayListener>
    );
  }

  if (Component) {
    return (
      <ItemContext.Provider
        value={{
          item,
          editing,
          setEditing,
          itemState,
          setItemState,
          reset,
          handleEnter,
        }}
      >
        <Component item={item} />
      </ItemContext.Provider>
    );
  } else {
    return (
      <div className="flex space-x-2 hover:bg-slate-100 p-2 transition-colors cursor-pointer delay-75 rounded-sm border-1  hover:border-slate-100">
        <span className="text-base">{item?.title}</span>
      </div>
    );
  }
}

function ItemTask({ item }: { item?: Item }) {
  const { editing, setEditing, itemState, setItemState, handleEnter, reset } =
    useContext(ItemContext);
  const { dispatch } = useContext(StoreContext);

  return (
    <ClickAwayListener onClickAway={reset}>
      <form onSubmit={handleEnter}>
        <div
          className={classNames(
            "flex space-x-2 group hover:bg-slate-100 p-2 transition-colors cursor-pointer delay-75 rounded-sm border-1",
            {
              "bg-slate-100": editing,
            }
          )}
          onClick={() => setEditing(true)}
        >
          {item?.status === "completed" ? (
            <BiCheckSquare
              className="w-6 h-6"
              onClick={() => {
                if (item) {
                  dispatch({
                    type: "update",
                    id: item?.id,
                    item: { ...item, status: "todo" },
                  });
                }
              }}
            />
          ) : (
            <BiSquare
              className="w-6 h-6"
              onClick={() => {
                if (item) {
                  dispatch({
                    type: "update",
                    id: item?.id,
                    item: { ...item, status: "completed" },
                  });
                }
              }}
            />
          )}
          {!editing ? (
            <div className="flex flex-col w-full ">
              <span className="text-base">{item?.title}</span>
              {item?.description ? (
                <span className="text-xs font-light">{item.description}</span>
              ) : null}
              {item?.deadline && (
                <div className="flex items-center space-x-1">
                  <BiCalendar className="text-xs" />
                  <span className="text-sm">
                    {formatDistanceStrict(new Date(item.deadline), new Date(), {
                      addSuffix: true,
                      roundingMethod: "ceil",
                      unit: "day",
                    })}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col flex-grow">
              <input
                className="text-base flex-grow bg-inherit outline-none border-collapse"
                placeholder="Title"
                autoFocus
                value={itemState.title}
                onChange={(e) =>
                  setItemState((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <textarea
                className="text-xs flex-grow bg-inherit outline-none border-collapse"
                placeholder="Description"
                value={itemState.description}
                onChange={(e) =>
                  setItemState((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          )}
          <select
            className="cursor-pointer bg-inherit h-8"
            value={item?.status || "todo"}
            onChange={(e) => {
              if (item) {
                dispatch({
                  type: "update",
                  id: item?.id,
                  item: { ...item, status: e.target.value },
                });
              }
            }}
          >
            <option value="todo">Not Started</option>
            <option value="inProgress" onClick={(e) => e.stopPropagation()}>
              In Progress
            </option>
            <option value="completed" onClick={(e) => e.stopPropagation()}>
              Completed
            </option>
          </select>
          <BiTrash className="p-1 group-hover:opacity-80 opacity-0 transition-all ease-in-out delay-75" />
        </div>
      </form>
    </ClickAwayListener>
  );
}

export default App;
