import Bool "mo:base/Bool";
import Func "mo:base/Func";
import List "mo:base/List";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor ShoppingList {
  // Define the structure for a shopping list item
  public type Item = {
    id: Nat;
    description: Text;
    completed: Bool;
  };

  // Stable variable to store the shopping list items
  stable var items : [Item] = [];
  stable var nextId : Nat = 0;

  // Function to add a new item to the shopping list
  public func addItem(description : Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem : Item = {
      id = id;
      description = description;
      completed = false;
    };
    items := Array.append(items, [newItem]);
    id
  };

  // Function to delete an item from the shopping list
  public func deleteItem(id : Nat) : async Bool {
    let (newItems, deleted) = Array.foldLeft<Item, ([Item], Bool)>(
      items,
      ([], false),
      func (acc, item) {
        if (item.id == id) {
          (acc.0, true)
        } else {
          (Array.append(acc.0, [item]), acc.1)
        }
      }
    );
    items := newItems;
    deleted
  };

  // Function to toggle the completion status of an item
  public func toggleComplete(id : Nat) : async Bool {
    items := Array.map<Item, Item>(
      items,
      func (item) {
        if (item.id == id) {
          {
            id = item.id;
            description = item.description;
            completed = not item.completed;
          }
        } else {
          item
        }
      }
    );
    true
  };

  // Query function to get all items
  public query func getItems() : async [Item] {
    items
  };
}
