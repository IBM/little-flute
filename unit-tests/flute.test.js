const { assert } = require("chai");
const shortcuts = require("../lib/shortcuts");
const flute = require("../index");

describe("flute", () => {
  describe("containsKeys", () => {
    let containsKeys = shortcuts.containsKeys;
    it("should return true if key exists in object", () => {
      assert.isTrue(containsKeys({ test: true }, "test"));
    });
    it("should return false if key does not exist in object", () => {
      assert.isTrue(containsKeys({ test: true }, "test"));
    });
    it("should return false if the get type is not an object and is lazy", () => {
      assert.isFalse(containsKeys("frog", "no", true), "it should be false");
    });
  });
  describe("isArray", () => {
    it("should return true if array", () => {
      assert.isTrue(shortcuts.isArray([]), "it should be");
    });
  });
  describe("isString", () => {
    let isString = shortcuts.isString;
    it("should return true if string", () => {
      assert.isTrue(isString("string"));
    });
    it("should return false if not string", () => {
      assert.isFalse(isString());
    });
  });
  describe("getType", () => {
    let getType = shortcuts.getType;
    it("should return array if is array", () => {
      assert.deepEqual(getType([]), "Array", "should return correct value");
    });
    it("should return Function if is Function", () => {
      assert.deepEqual(
        getType(getType),
        "Function",
        "should return correct value"
      );
    });
    it("should return typeof if is not function or Array", () => {
      assert.deepEqual(getType({}), "object", "should return correct value");
    });
  });
  describe("flute", () => {
    it("should return resource with empty object", () => {
      let actualData = new flute(`{ "resource" : {} }`).parse();
      let expectedData = {
        resource: {},
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with value", () => {
      let actualData = new flute(`{ "resource" : { "frog": true } }`).parse();
      let expectedData = {
        resource: {
          frog: true,
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with two ojects", () => {
      let actualData = new flute(`{ "resource" : {}, "resource": {} }`).parse();
      let expectedData = {
        resource: {},
        resource_: {},
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with two ojects with values", () => {
      let actualData = new flute(
        `{ "resource" : { "frog": true }, "resource": { "frog": true } }`
      ).parse();
      let expectedData = {
        resource: {
          frog: true,
        },
        resource_: {
          frog: true,
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with two ojects with nested objects", () => {
      let actualData = new flute(
        `{ "resource" : { "a" : {} }, "resource": { "a" : {} } }`,
        true
      ).parse();
      let expectedData = {
        resource: {
          a: {},
        },
        resource_: {
          a: {},
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with two ojects with nested nested objects", () => {
      let actualData = new flute(
        `{ "resource" : { "a" : { "b": {} } }, "resource": { "a" : { "b": {} } } }`,
        true
      ).parse();
      let expectedData = {
        resource: {
          a: {
            b: {},
          },
        },
        resource_: {
          a: { b: {} },
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with nested nested objects with duplicate fields", () => {
      let actualData = new flute(
        `{ "resource" : { "a" : { "b": {}, "b": {} } } }`,
        true
      ).parse();
      let expectedData = {
        resource: {
          a: {
            b: {},
            b_: {},
          },
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with nested nested objects with duplicate fields and values", () => {
      let actualData = new flute(
        `{ "resource" : { "a" : { "b": {"frog": true}, "b": {"frog": true} } } }`,
        true
      ).parse();
      let expectedData = {
        resource: {
          a: {
            b: {
              frog: true,
            },
            b_: {
              frog: true,
            },
          },
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with nested nested nested objects with duplicate fields", () => {
      let actualData = new flute(
        `{ "resource" : { "a" : { "b": { "c": {"frog": true}, "c": {"frog": true}, "c": {"frog": true} }, "b": { "c": {"frog": true}, "c": {"frog": true}, "c": {"frog": true} } } } }`,
        true
      ).parse();
      let expectedData = {
        resource: {
          a: {
            b: {
              c__: {
                frog: true,
              },
              c_: {
                frog: true,
              },
              c: {
                frog: true,
              },
            },
            b_: {
              c__: { frog: true },
              c_: { frog: true },
              c: { frog: true },
            },
          },
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with nested nested objects with duplicate fields with arrays of objects", () => {
      let actualData = new flute(
        `{ "resource" : { "a" : [{ "foo" : true },{ "foo" : true }] } }`,
        true
      ).parse();
      let expectedData = {
        resource: {
          a: [
            {
              foo: true,
            },
            {
              foo: true,
            },
          ],
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with nested nested objects with duplicate fields with arrays of objects", () => {
      let actualData = new flute(
        `{ "resource" : { "a" : [{ "foo" : true, "foo" : true },{ "foo" : true, "foo" : true }] } }`,
        true
      ).parse();
      let expectedData = {
        resource: {
          a: [
            {
              foo_: true,
              foo: true,
            },
            {
              foo_: true,
              foo: true,
            },
          ],
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return resource with nested nested objects with duplicate fields with arrays of objects", () => {
      let actualData = new flute(
        `{ "resource" : { "a" : [{ "foo" : true, "foo" : true },{ "foo" : true, "foo" : true }], "a" : [{ "foo" : true, "foo" : true },{ "foo" : true, "foo" : true }] } }`,
        true
      ).parse();
      let expectedData = {
        resource: {
          a: [
            {
              foo_: true,
              foo: true,
            },
            {
              foo_: true,
              foo: true,
            },
          ],
          a_: [
            {
              foo_: true,
              foo: true,
            },
            {
              foo_: true,
              foo: true,
            },
          ],
        },
      };
      assert.deepEqual(
        actualData,
        expectedData,
        "it should return correct data"
      );
    });
    it("should return aws object", () => {
      let actualData = new flute(
        JSON.stringify({
          resource: {
            aws_instance: {
              example: {
                instance_type: "t2.micro",
                ami: "ami-abc123",
              },
            },
          },
        })
      ).parse();
      let expectedData = {
        resource: {
          aws_instance: {
            example: {
              instance_type: "t2.micro",
              ami: "ami-abc123",
            },
          },
        },
      };
      assert.deepEqual(actualData, expectedData, "it should return data");
    });
    it("should return aws object with nested string", () => {
      let actualData = new flute(
        JSON.stringify({
          resource: {
            aws_instance: {
              example: {
                instance_type: ["t2.micro"],
                ami: "ami-abc123",
              },
            },
          },
        }),
        true
      ).parse();
      let expectedData = {
        resource: {
          aws_instance: {
            example: {
              instance_type: ["t2.micro"],
              ami: "ami-abc123",
            },
          },
        },
      };
      assert.deepEqual(actualData, expectedData, "it should return data");
    });
    it("should return aws object with nested object", () => {
      let actualData = new flute(
        JSON.stringify({
          resource: {
            aws_instance: {
              example: {
                instance_type: {
                  type: "t2.micro",
                },
                ami: "ami-abc123",
              },
            },
          },
        })
      ).parse();
      let expectedData = {
        resource: {
          aws_instance: {
            example: {
              instance_type: {
                type: "t2.micro",
              },
              ami: "ami-abc123",
            },
          },
        },
      };
      assert.deepEqual(actualData, expectedData, "it should return data");
    });
    it("should return aws object with nested array", () => {
      let actualData = new flute(
        JSON.stringify({
          resource: {
            aws_instance: {
              example: {
                instance_type: {
                  type: ["t2.micro"],
                },
                ami: "ami-abc123",
              },
            },
          },
        })
      ).parse();
      let expectedData = {
        resource: {
          aws_instance: {
            example: {
              instance_type: {
                type: ["t2.micro"],
              },
              ami: "ami-abc123",
            },
          },
        },
      };
      assert.deepEqual(actualData, expectedData, "it should return data");
    });
    it("should run callbacks and return aws object with nested array", () => {
      let actualData = new flute(
        JSON.stringify({
          resource: {
            aws_instance: {
              example: {
                instance_type: {
                  type: ["t2.micro"],
                },
                ami: "ami-abc123",
              },
            },
          },
        }),
        {
          onKey: function () {},
          onCloseArray: function () {},
          onOpenArray: function () {},
          onOpenObject: function () {},
          onCloseObject: function () {},
          onValue: function () {},
        }
      ).parse();
      let expectedData = {
        resource: {
          aws_instance: {
            example: {
              instance_type: {
                type: ["t2.micro"],
              },
              ami: "ami-abc123",
            },
          },
        },
      };
      assert.deepEqual(actualData, expectedData, "it should return data");
    });
    it("should throw an error when a non-string is passed", () => {
      let task = () => new flute({});
      assert.throws(
        task,
        "flute expects passed item to be a string got object"
      );
    });

    describe("flute", () => {
      describe("flute.onOpenObject", () => {
        it("should add the index for an array", () => {
          let note = new flute("");
          note.parsedJson = { resource: { a: [] } };
          note.layers = ["resource", "a"];
          note.onOpenObject("foo");
          assert.deepEqual(
            note.layers,
            ["resource", "a", "0", "foo"],
            "it should have correct layers"
          );
        });
        it("should add fields to nested sub objects", () => {
          let note = new flute("");
          note.parsedJson = { resource: { aws_instance: { example: {} } } };
          note.layers = ["resource", "aws_instance", "example"];
          note.onOpenObject("instance_type");
          assert.deepEqual(
            note.layers,
            ["resource", "aws_instance", "example", "instance_type"],
            "it should have correct layers"
          );
        });
      });
      describe("flute.onKey", () => {
        it("should not add undefined keys", () => {
          let note = new flute("");
          note.parsedJson = { resource: { a: [] } };
          note.layers = ["resource", "a"];
          note.onKey(undefined);
          assert.deepEqual(
            note.layers,
            ["resource", "a"],
            "it should have correct layers"
          );
        });
      });
    });
  });
});
