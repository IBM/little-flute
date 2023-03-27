# little-flute

`little-flute` is a minimal dependency json parser that can be used to parse JSON objects with multiple duplicate keys.

## Example Usage

```js
const flute = require("little-flute")

new flute(
  `{
    "resource": {
      "aws_instance": {
        "example": {
          "instance_type": {
            "type": "t2.micro"
          },
          "ami": "ami-abc123"
        }
      },
      "aws_instance": {
        "example2": {
          "instance_type": {
            "type": "t2.micro"
          },
          "ami": "ami-abc123"
        }
      }
    }
  }`
).parse();
```

Returns the value :
```js
{
  "resource": {
    "aws_instance": {
      "example": {
        "instance_type": {
          "type": "t2.micro"
        },
        "ami": "ami-abc123"
      }
    },
    "aws_instance_": { // duplicate keys will have an _ appended
      "example2": {
        "instance_type": {
          "type": "t2.micro"
        },
        "ami": "ami-abc123"
      }
    }
  }
}
```

## Extensions

Users can extend the `flute` constructor before parse with callback functions. Each callback returns `currentRef`, the part of the larget object that is currently being manipluated, and `parsedJson`, the entire JSON object.

```js
const flute = require("little-flute");

let extendedFlute = new flute(
  `{
    "resource": {
      "aws_instance": {
        "example": {
          "instance_type": {
            "type": "t2.micro"
          },
          "ami": "ami-abc123"
        }
      },
      "aws_instance": {
        "example2": {
          "instance_type": {
            "type": "t2.micro"
          },
          "ami": "ami-abc123"
        }
      }
    }
  }`,
  {
    onKey: function(key, currenRef, parsedJson) {
      // edit data after a new key has been added
    },
    onValue: function(value, currenRef, parsedJson) {
      // edit data when a new value is added
    },
    onOpenObject: function(key, currenRef, parsedJson) {
      // edit data after a new object has been opened
    },
    onCloseObject: function(currenRef, parsedJson) {
      // edit data after an object is closed
    },
    onOpenArray: function(currenRef, parsedJson) {
      // edit data after a new array has been opened
    },
    onCloseArray: function(currenRef, parsedJson) {
      // edit data after an array is closed
    }
  }
)

```