# Snapshot report for `test/webpack-plugin.js`

The actual snapshot is saved in `webpack-plugin.js.snap`.

Generated by [AVA](https://ava.li).

## Writes C# files to disk

> Snapshot 1

    `using System.Collections.Generic;␊
    ␊
    public class Link ␊
    {␊
      public string Text { get; set; }␊
      public string Url { get; set; }␊
    }␊
    ␊
    `

> Snapshot 2

    `using System.Collections.Generic;␊
    ␊
    public class ClassComponent ␊
    {␊
      [Required]␊
      public string Text { get; set; }␊
      public bool IsSomething { get; set; }␊
      public int Number { get; set; }␊
      public int IntNumber { get; set; }␊
      public float FloatNumber { get; set; }␊
      public IList<string> Texts { get; set; }␊
      public SingleObject SingleObject { get; set; }␊
      [Required]␊
      public IList<ObjectsItem> Objects { get; set; }␊
      public IList<IList<IList<string>>> NestedList { get; set; }␊
      public Link Link { get; set; }␊
      public IList<Link> LinkList { get; set; }␊
      public Link LinkMeta { get; set; }␊
      public IList<Link> LinkListMeta { get; set; }␊
      [Required]␊
      public EnumArray EnumArray { get; set; }␊
      public EnumInline EnumInline { get; set; }␊
      public EnumObject EnumObject { get; set; }␊
    }␊
    ␊
    public class SingleObject ␊
    {␊
      [Required]␊
      public string PropertyA { get; set; }␊
    }␊
    ␊
    public class ObjectsItem ␊
    {␊
      public string PropertyB { get; set; }␊
    }␊
    ␊
    public enum EnumArray ␊
    {␊
      [StringValue("value-1")]␊
      Value1 = 0,␊
      [StringValue("value-2")]␊
      Value2 = 1,␊
    }␊
    ␊
    public enum EnumInline ␊
    {␊
      EnumInline1 = 1,␊
      EnumInline2 = 2,␊
    }␊
    ␊
    public enum EnumObject ␊
    {␊
      [StringValue("valueA")]␊
      ValueA = 0,␊
      [StringValue("valueB")]␊
      ValueB = 1,␊
    }␊
    ␊
    `

> Snapshot 3

    `using System.Collections.Generic;␊
    ␊
    public class FunctionalComponent ␊
    {␊
      [Required]␊
      public string Text { get; set; }␊
      public bool IsSomething { get; set; }␊
      public int Number { get; set; }␊
      public int IntNumber { get; set; }␊
      public float FloatNumber { get; set; }␊
      public IList<string> Texts { get; set; }␊
      public SingleObject SingleObject { get; set; }␊
      [Required]␊
      public IList<ObjectsItem> Objects { get; set; }␊
      public IList<IList<IList<string>>> NestedList { get; set; }␊
      public Link Link { get; set; }␊
      public IList<Link> LinkList { get; set; }␊
      public Link LinkMeta { get; set; }␊
      public IList<Link> LinkListMeta { get; set; }␊
      [Required]␊
      public EnumArray EnumArray { get; set; }␊
      public EnumInline EnumInline { get; set; }␊
      public EnumObject EnumObject { get; set; }␊
    }␊
    ␊
    public class SingleObject ␊
    {␊
      [Required]␊
      public string PropertyA { get; set; }␊
    }␊
    ␊
    public class ObjectsItem ␊
    {␊
      public string PropertyB { get; set; }␊
    }␊
    ␊
    public enum EnumArray ␊
    {␊
      [StringValue("value-1")]␊
      Value1 = 0,␊
      [StringValue("value-2")]␊
      Value2 = 1,␊
    }␊
    ␊
    public enum EnumInline ␊
    {␊
      EnumInline1 = 1,␊
      EnumInline2 = 2,␊
    }␊
    ␊
    public enum EnumObject ␊
    {␊
      [StringValue("valueA")]␊
      ValueA = 0,␊
      [StringValue("valueB")]␊
      ValueB = 1,␊
    }␊
    ␊
    `