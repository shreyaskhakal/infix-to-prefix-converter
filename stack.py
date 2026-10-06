"""
Custom Stack Implementation for Interactive Infix-to-Prefix DSA Lab.

The Stack is an abstract data type that serves as a collection of elements,
with two principal operations:
  - push: adds an element to the collection (Top)
  - pop: removes the most recently added element (Top)

The order in which elements are removed follows LIFO (Last In, First Out).
"""

from typing import Any, List, Optional


class Stack:
    """
    A custom, robust Stack data structure adhering to the LIFO principle.

    All internal storage is encapsulated. All algorithm operations must strictly
    use the class methods: push, pop, peek, is_empty, size, clear, display.
    """

    def __init__(self) -> None:
        self._items: List[Any] = []
        self.push_count: int = 0
        self.pop_count: int = 0
        self.peek_count: int = 0
        self.max_size: int = 0

    def push(self, item: Any) -> None:
        """
        Push an element onto the top of the stack.

        Time Complexity: O(1) amortized
        """
        self._items.append(item)
        self.push_count += 1
        if len(self._items) > self.max_size:
            self.max_size = len(self._items)

    def pop(self) -> Any:
        """
        Remove and return the top element from the stack.
        Raises IndexError if the stack is empty.

        Time Complexity: O(1)
        """
        if self.is_empty():
            raise IndexError("pop from empty stack: Stack Underflow")
        self.pop_count += 1
        return self._items.pop()

    def peek(self) -> Any:
        """
        Return the top element without removing it.
        Raises IndexError if the stack is empty.

        Time Complexity: O(1)
        """
        if self.is_empty():
            raise IndexError("peek from empty stack")
        self.peek_count += 1
        return self._items[-1]

    def is_empty(self) -> bool:
        """
        Check whether the stack contains no elements.

        Time Complexity: O(1)
        """
        return len(self._items) == 0

    def size(self) -> int:
        """
        Return the number of elements currently stored in the stack.

        Time Complexity: O(1)
        """
        return len(self._items)

    def clear(self) -> None:
        """
        Remove all elements from the stack.

        Time Complexity: O(1)
        """
        self._items.clear()

    def display(self) -> str:
        """
        Return a user-friendly string representation of the stack
        from bottom to top.
        """
        if self.is_empty():
            return "Stack: [EMPTY]"
        return "Stack (Bottom -> Top): [" + ", ".join(str(x) for x in self._items) + "]"

    def snapshot(self) -> List[Any]:
        """
        Return a copy of the current stack items from bottom to top.
        Guarantees that historical snapshots remain immutable even if the stack changes.
        """
        return list(self._items)

    def to_list(self) -> List[Any]:
        """
        Alias for snapshot().
        """
        return self.snapshot()

    def get_stats(self) -> dict:
        """
        Return actual operational metrics tracked by the Stack.
        """
        return {
            "pushes": self.push_count,
            "pops": self.pop_count,
            "peeks": self.peek_count,
            "max_size": self.max_size,
            "current_size": self.size(),
        }

    def __len__(self) -> int:
        return self.size()

    def __bool__(self) -> bool:
        return not self.is_empty()

    def __repr__(self) -> str:
        return f"Stack({self._items!r})"

    def __str__(self) -> str:
        return self.display()
