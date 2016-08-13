<style>
  .key-value-li > div {
    width: 50%;
    float: left;
  }
</style>

<div>
  <!-- 开关控件(名称) -->
  <label for="stateField">开关名称：</label>
  <input type="text" name="stateField" id="stateField" placeholder="开关名称" />
  <a class="button is-active state-add-button" ><i class="fa fa-plus-circle"></i>添加状态</a>
  <ul class="key-value-ul">
  </ul>
</div>


<script type="text/template" id="value-key-tpl">
 <li class="key-value-li">
    <div class="ui labeled input">
          <div class="ui label">值</div>
          <input type="text" placeholder="1,2,3...">
        </div>
        <div class="ui labeled input">
          <div class="ui label">色</div>
          <input type="color" name="state_color" id="state_color" value="#000">
        </div>
        <li>
</script>